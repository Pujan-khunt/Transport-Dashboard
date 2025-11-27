"use client";

import { useState } from "react";
import Papa from "papaparse"; 
import { useRouter } from "next/navigation";
import { uploadOptedInEmails } from "@/app/actions/optedInActions";
import { Loader2, Users } from "lucide-react";

export default function OptedInUploadButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setMessage("Parsing...");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data as any[];

        // Check if data is empty
        if (data.length === 0) {
            setMessage("Error: File is empty.");
            setIsLoading(false);
            return;
        }

        // Simple check for email column existence in first row
        const firstRow = data[0];
        if (!('email' in firstRow || 'Email' in firstRow || 'EMAIL' in firstRow)) {
             setMessage("Error: Missing 'email' column.");
             setIsLoading(false);
             return;
        }

        setMessage("Uploading...");
        
        try {
            const response = await uploadOptedInEmails(data);

            if (response.error) {
              setMessage(response.error);
            } else {
              setMessage("Done!");
              router.refresh();
              setTimeout(() => setMessage(""), 3000);
            }
        } catch (err) {
            setMessage("Upload failed.");
        } finally {
            setIsLoading(false);
        }
      },
      error: () => {
        setMessage("Error parsing file.");
        setIsLoading(false);
      },
    });
  };

  return (
    <div className="flex items-center gap-3">
      {message && <span className="text-sm text-gray-400 animate-pulse whitespace-pre-wrap">{message}</span>}
      
      <label
        className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md shadow-sm cursor-pointer hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Users className="w-4 h-4" />
        )}
        {isLoading ? "..." : "Upload Users"}
        
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isLoading}
          onClick={(e) => (e.currentTarget.value = "")}
        />
      </label>
    </div>
  );
}