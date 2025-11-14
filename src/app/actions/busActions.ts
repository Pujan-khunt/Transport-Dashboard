'use server'

import { db } from "@/db"
import { bus, NewBus } from "@/db/schema/bus"
import { auth } from "@/auth/next-auth" // Get auth session
import { revalidatePath } from "next/cache"

// This is the shape of the data we get from Papaparse
type CsvRow = {
  origin: "Uniworld-1" | "Uniworld-2" | "Macro" | "Special"
  destination: "Uniworld-1" | "Uniworld-2" | "Macro" | "Special"
  specialDestination?: string | null
  departureTime: string
  status: string
  isPaid: string // Papaparse gives us strings
}

/**
 * Parses a "DD-MM-YYYY HH:MM" string into a Date object.
 * @param dateTimeString The date string to parse.
 */
function parseCustomDateTime(dateTimeString: string): Date {
  try {
    const [datePart, timePart] = dateTimeString.split(' ');
    const [day, month, year] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');
    
    // JS Date constructor: new Date(year, monthIndex, day, hours, minutes)
    // Month is 0-indexed (0=Jan, 1=Feb, ...), so we must subtract 1.
    const date = new Date(
      parseInt(year), 
      parseInt(month) - 1, 
      parseInt(day), 
      parseInt(hours), 
      parseInt(minutes)
    );

    if (isNaN(date.getTime())) {
      throw new Error('Parsed date is invalid');
    }
    return date;
  } catch (e) {
    console.error(`Failed to parse date: ${dateTimeString}`, e);
    throw new Error(`Invalid date format for: "${dateTimeString}". Please use DD-MM-YYYY HH:MM`);
  }
}

export async function replaceSchedule(csvData: CsvRow[]) {
  try {
    // 1. Check for Admin Authentication (like your API routes)
    const session = await auth()
    if (!session?.user?.isAdmin) {
      throw new Error("Unauthorized: Admin access required.")
    }

    // 2. Validate and transform CSV data for the database
    const newBuses: NewBus[] = csvData
      .filter(row => row.origin || row.destination || row.departureTime) // <-- ADD THIS FILTER
      .map((row, i) => {
      // Basic validation
      if (!row.origin || !row.destination || !row.departureTime) {
        throw new Error(`Row ${i + 2}: Missing required fields (origin, destination, or departureTime).`)
      }

      return {
        origin: row.origin,
        destination: row.destination,
        specialDestination: row.specialDestination || null,
        departureTime: parseCustomDateTime(row.departureTime), // <-- USE OUR NEW PARSER
        status: row.status || "On Time",
        isPaid: row.isPaid?.toLowerCase() === 'true', // Convert string to boolean
      }
    })

    if (newBuses.length === 0) {
      throw new Error("No valid data to insert.")
    }

    // 3. Run as an Atomic Transaction
    await db.transaction(async (tx) => {
      // Step A: Delete all existing buses
      await tx.delete(bus)
      
      // Step B: Insert all new buses
      await tx.insert(bus).values(newBuses)
    })

    // 4. Revalidate the cache for the page to show new data
    revalidatePath('/') // Or whatever page shows your buses

    return { success: true, inserted: newBuses.length }

  } catch (error: any) {
    console.error("Error replacing schedule:", error)
    // Send a specific error message back to the client
    return { error: error.message || "An unknown database error occurred." }
  }
}