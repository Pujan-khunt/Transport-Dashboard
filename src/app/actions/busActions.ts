"use server";

import { db } from "@/db";
import { bus, NewBus } from "@/db/schema/bus";
import { auth } from "@/auth/next-auth";
import { revalidatePath } from "next/cache";

// valid locations for regular bus routes
const VALID_LOCATIONS = ["Uniworld-1", "Uniworld-2", "Macro"] as const;

// raw csv row structure
type RawCsvRow = {
	'Special': string; 
	'Source': string;
	'Destination': string;
	'Departure Time': string;
	'Status': string;
	'Is Paid': string; 
};

// error details for a specific row
export type RowValidationError = {
	row: number; 
	error: string; 
};

// response from the server action
export type ScheduleResponse = {
    success: boolean;
    inserted: number;
    errors: RowValidationError[];
    message?: string;
};


// helper to parse our custom date format
function parseCustomDateTime(dateTimeString: string): Date | null {
	try {
		const [datePart, timePart] = dateTimeString.split(" ");
		// basic check to see if format is ok
		if (!datePart || !timePart) return null;

		const [day, month, year] = datePart.split("-").map(Number);
		const [hours, minutes] = timePart.split(":").map(Number);

		// create date object. remember month is 0 indexed
		const date = new Date(year, month - 1, day, hours, minutes);

		// check if date is valid
		if (isNaN(date.getTime())) {
			return null;
		}
		// make sure js didn't roll over the date like feb 31 to mar 3
		if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
			return null;
		}

		return date;
	} catch (e) {
		// return null if anything crashes
		return null;
	}
}

// checks one row for any issues
function validateRow(rowData: RawCsvRow, rowIndex: number): RowValidationError[] {
    const errors: RowValidationError[] = [];
    // actual row number in the csv file
    const rowNumber = rowIndex + 2; 

    // clean up the data
    const isSpecial = rowData['Special']?.trim().toLowerCase() === 'true';
    const source = rowData['Source']?.trim();
    const destination = rowData['Destination']?.trim();
    const departureTimeStr = rowData['Departure Time']?.trim();
    const isPaidStr = rowData['Is Paid']?.trim().toLowerCase();
    const status = rowData['Status']?.trim();

    // check if required fields are present
    if (!source) {
        errors.push({ row: rowNumber, error: 'Source is required.' });
    }
    if (!destination) {
        errors.push({ row: rowNumber, error: 'Destination is required.' });
    }
    if (!departureTimeStr) {
        errors.push({ row: rowNumber, error: 'Departure Time is required.' });
    }

    // stop here if basics are missing
    if (errors.length > 0) return errors; 
    
    // source and dest cant be same
    if (source === destination) {
        errors.push({ row: rowNumber, error: 'Source and Destination cannot be the same.' });
    }

    // check if source is a valid known location
    const isValidSource = VALID_LOCATIONS.includes(source as any);

    // VALIDATION RULES:
    // 1. If it is NOT special, both Source and Dest must be valid locations.
    // 2. If it IS special, we are more lenient, but if the Source is invalid, 
    //    it will default to 'Special' in the DB. 
    
    if (!isSpecial) {
        const isValidDestination = VALID_LOCATIONS.includes(destination as any);

        if (!isValidSource) {
            errors.push({ 
                row: rowNumber, 
                error: `Source '${source}' is invalid. Must be one of: ${VALID_LOCATIONS.join(', ')}.` 
            });
        }
        if (!isValidDestination) {
            errors.push({ 
                row: rowNumber, 
                error: `Destination '${destination}' is invalid. Must be one of: ${VALID_LOCATIONS.join(', ')}.` 
            });
        }
    } 
    // Optional: Uncomment this block if you want to ENFORCE that even special buses 
    // must start from a valid campus location (Uniworld/Macro)
    /*
    else {
        if (!isValidSource) {
             errors.push({ 
                row: rowNumber, 
                error: `Special Bus Source '${source}' is unknown. Must start from: ${VALID_LOCATIONS.join(', ')}.` 
            });
        }
    }
    */

    // check time format
    const parsedTime = parseCustomDateTime(departureTimeStr);
    if (!parsedTime) {
        errors.push({ 
            row: rowNumber, 
            error: `Departure Time format is invalid for '${departureTimeStr}'. Use DD-MM-YYYY HH:MM.` 
        });
    }

    // check is paid flag
    if (isPaidStr && !['true', 'false', '0', '1'].includes(isPaidStr)) {
        errors.push({ 
            row: rowNumber, 
            error: `Is Paid value is invalid. Use 'True' or 'False'.` 
        });
    }
    
    return errors;
}


export async function replaceSchedule(csvData: RawCsvRow[]): Promise<ScheduleResponse> {
	try {
		// check if user is admin
		const session = await auth();
		if (!session?.user?.isAdmin) {
			return { 
                success: false, 
                inserted: 0, 
                errors: [], 
                message: "Unauthorized: Only administrators can upload schedules." 
            };
		}

        // setup lists for errors and valid buses
        const validationErrors: RowValidationError[] = [];
        const validBuses: NewBus[] = [];
        
        // handle empty file
        if (csvData.length === 0) {
            return { 
                success: false, 
                inserted: 0, 
                errors: [], 
                message: "CSV file is empty. Nothing to process." 
            };
        }


		// loop through all rows to validate
        csvData.forEach((row, i) => {
            const errors = validateRow(row, i);
            
            if (errors.length > 0) {
                // collect errors if any
                validationErrors.push(...errors);
            } else {
                // otherwise format it for the db
                const isSpecial = row['Special']?.trim().toLowerCase() === 'true';
                const departureDate = parseCustomDateTime(row['Departure Time'].trim())!;
                
                const source = row['Source'].trim();
                // check if source is one of our known campuses
                const isSourceValidEnum = VALID_LOCATIONS.includes(source as any);

                validBuses.push({
                    
                    // If source is a valid campus (Uniworld-1 etc), use it.
                    // If not (e.g. 'Airport'), default to 'Special'.
                    origin: isSourceValidEnum ? (source as 'Uniworld-1' | 'Uniworld-2' | 'Macro') : 'Special',
                    
                    // Destination is 'Special' flag if it's a special route, otherwise the real location
                    destination: isSpecial ? 'Special' : row['Destination'].trim() as 'Uniworld-1' | 'Uniworld-2' | 'Macro',

                    // special dest only matters for special routes
                    specialDestination: isSpecial ? row['Destination'].trim() : null,
                    
                    departureTime: departureDate, 
                    status: row['Status']?.trim() || "On Time", 
                    // handle the boolean conversion
                    isPaid: row['Is Paid']?.trim().toLowerCase() === "true" || row['Is Paid']?.trim() === "1", 
                });
            }
        });


		// if we found errors return them now
        if (validationErrors.length > 0) {
            return {
                success: false,
                inserted: 0,
                errors: validationErrors,
                message: `Found ${validationErrors.length} errors. No data was uploaded.`
            };
        }

        // data is good so we can save it
        
		// run database update as a transaction
		await db.transaction(async (tx) => {
			// clear old schedule
			await tx.delete(bus);

			// insert new schedule
			await tx.insert(bus).values(validBuses);
		});

		// refresh the page data
		revalidatePath("/");

		return { 
            success: true, 
            inserted: validBuses.length, 
            errors: [], 
            message: `Upload successful! ${validBuses.length} schedules replaced.` 
        };
	} catch (error: any) {
		console.error("Critical error replacing schedule:", error);
		
		// catch any other crashes
		return { 
            success: false, 
            inserted: 0, 
            errors: [], 
            message: `A critical server error occurred: ${error.message || "Unknown error."}` 
        };
	}
}