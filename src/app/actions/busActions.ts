"use server";

import { db } from "@/db";
import { bus, NewBus } from "@/db/schema/bus";
import { auth } from "@/auth/next-auth";
import { revalidatePath } from "next/cache";

// Valid locations for regular bus routes (excluding "Special")
const VALID_LOCATIONS = ["Uniworld-1", "Uniworld-2", "Macro"] as const;

// Raw CSV row structure (Special column removed)
type RawCsvRow = {
	'Source': string;
	'Destination': string;
	'Departure Time': string;
	'Status': string;
	'Is Paid': string; 
};

export type RowValidationError = {
	row: number; 
	error: string; 
};

export type ScheduleResponse = {
    success: boolean;
    inserted: number;
    errors: RowValidationError[];
    message?: string;
};

// Helper to parse DD-MM-YYYY HH:MM
function parseCustomDateTime(dateTimeString: string): Date | null {
	try {
		const [datePart, timePart] = dateTimeString.split(" ");
		if (!datePart || !timePart) return null;

		const [day, month, year] = datePart.split("-").map(Number);
		const [hours, minutes] = timePart.split(":").map(Number);

		const date = new Date(year, month - 1, day, hours, minutes);

		// Validation check
		if (isNaN(date.getTime())) return null;
		if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
			return null;
		}

		return date;
	} catch (e) {
		return null;
	}
}

// Validate individual row
function validateRow(rowData: RawCsvRow, rowIndex: number): RowValidationError[] {
    const errors: RowValidationError[] = [];
    const rowNumber = rowIndex + 2; 

    const source = rowData['Source']?.trim();
    const destination = rowData['Destination']?.trim();
    const departureTimeStr = rowData['Departure Time']?.trim();
    const isPaidStr = rowData['Is Paid']?.trim().toLowerCase();

    // 1. Required Fields Check
    if (!source) errors.push({ row: rowNumber, error: 'Source is required.' });
    if (!destination) errors.push({ row: rowNumber, error: 'Destination is required.' });
    if (!departureTimeStr) errors.push({ row: rowNumber, error: 'Departure Time is required.' });

    if (errors.length > 0) return errors; 
    
    // 2. Logic Check: Source != Destination
    if (source === destination) {
        errors.push({ row: rowNumber, error: 'Source and Destination cannot be the same.' });
    }

    // 3. Time Format Check
    const parsedTime = parseCustomDateTime(departureTimeStr);
    if (!parsedTime) {
        errors.push({ 
            row: rowNumber, 
            error: `Departure Time format is invalid for '${departureTimeStr}'. Use DD-MM-YYYY HH:MM.` 
        });
    }

    // 4. Boolean Check
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
		const session = await auth();
		if (!session?.user?.isAdmin) {
			return { 
                success: false, 
                inserted: 0, 
                errors: [], 
                message: "Unauthorized: Only administrators can upload schedules." 
            };
		}

        const validationErrors: RowValidationError[] = [];
        const validBuses: NewBus[] = [];
        
        if (csvData.length === 0) {
            return { 
                success: false, 
                inserted: 0, 
                errors: [], 
                message: "CSV file is empty." 
            };
        }

        // Process rows
        csvData.forEach((row, i) => {
            const errors = validateRow(row, i);
            
            if (errors.length > 0) {
                validationErrors.push(...errors);
            } else {
                const departureDate = parseCustomDateTime(row['Departure Time'].trim())!;
                const source = row['Source'].trim();
                const destination = row['Destination'].trim();
                
                // Determine Origin logic
                const isSourceStandard = VALID_LOCATIONS.includes(source as any);
                const origin = isSourceStandard ? (source as 'Uniworld-1' | 'Uniworld-2' | 'Macro') : 'Special';
                const specialOrigin = isSourceStandard ? null : source;

                // Determine Destination logic
                const isDestStandard = VALID_LOCATIONS.includes(destination as any);
                const dest = isDestStandard ? (destination as 'Uniworld-1' | 'Uniworld-2' | 'Macro') : 'Special';
                const specialDestination = isDestStandard ? null : destination;

                validBuses.push({
                    origin: origin,
                    specialOrigin: specialOrigin,
                    destination: dest,
                    specialDestination: specialDestination,
                    departureTime: departureDate, 
                    status: row['Status']?.trim() || "On Time", 
                    isPaid: row['Is Paid']?.trim().toLowerCase() === "true" || row['Is Paid']?.trim() === "1", 
                });
            }
        });

        if (validationErrors.length > 0) {
            return {
                success: false,
                inserted: 0,
                errors: validationErrors,
                message: `Found ${validationErrors.length} errors. No data was uploaded.`
            };
        }

        // Database Transaction
		await db.transaction(async (tx) => {
			await tx.delete(bus);
			await tx.insert(bus).values(validBuses);
		});

		revalidatePath("/");

		return { 
            success: true, 
            inserted: validBuses.length, 
            errors: [], 
            message: `Upload successful! ${validBuses.length} schedules replaced.` 
        };
	} catch (error: any) {
		console.error("Critical error replacing schedule:", error);
		return { 
            success: false, 
            inserted: 0, 
            errors: [], 
            message: `A critical server error occurred: ${error.message || "Unknown error."}` 
        };
	}
}