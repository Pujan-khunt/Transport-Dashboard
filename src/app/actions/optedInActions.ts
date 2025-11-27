"use server";

import { db } from "@/db";
import { optedInEmails } from "@/db/schema/opted-in";
import { auth } from "@/auth/next-auth";
import { revalidatePath } from "next/cache";

type CsvRow = {
  
  email?: string;
  Email?: string;
  EMAIL?: string;
  [key: string]: any;
};

const ALLOWED_DOMAINS = ["scaler.com", "sst.scaler.com"];

export async function uploadOptedInEmails(csvData: CsvRow[]) {
  try {
    // 1. Security Check: Must be Admin
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return { error: "Unauthorized: Only admins can upload user lists." };
    }

    if (csvData.length === 0) {
      return { error: "File is empty." };
    }

    // 2. Normalize and Validate Data
    const validEmails: string[] = [];
    const errors: string[] = [];

    csvData.forEach((row, index) => {
        
        const rawEmail = row.email || row.Email || row.EMAIL;
        
        if (!rawEmail) {
            
            return;
        }

        const email = rawEmail.trim().toLowerCase();
        const domain = email.split('@')[1];

        // STRICT VALIDATION: Check domain
        if (!ALLOWED_DOMAINS.includes(domain)) {
            errors.push(`Row ${index + 2}: Invalid domain for ${email}. Must be @scaler.com or @sst.scaler.com`);
        } else {
            validEmails.push(email);
        }
    });

    // If ANY invalid domains are found, reject the whole file
    if (errors.length > 0) {
  
        const errorMsg = `Upload Failed. ${errors.length} errors found:\n` + errors.slice(0, 5).join('\n') + (errors.length > 5 ? '\n...' : '');
        return { error: errorMsg };
    }

    if (validEmails.length === 0) {
      return { error: "No valid emails found in the file." };
    }

    
    await db
      .insert(optedInEmails)
      .values(validEmails.map((email) => ({ email })))
      .onConflictDoNothing({ target: optedInEmails.email });

    revalidatePath("/admin");

    return {
      success: true,
      message: `Success! Processed ${validEmails.length} opted-in students.`,
    };

  } catch (error: any) {
    console.error("Error uploading opted-in emails:", error);
    return { error: "A server error occurred during upload." };
  }
}