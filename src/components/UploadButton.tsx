'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import { useRouter } from 'next/navigation'
import { replaceSchedule } from '@/app/actions/busActions' // Import the server action

export default function CsvUploadButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    setIsLoading(true)
    setMessage('Parsing file...')

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data as any[]
        
        // --- 1. Client-side Validation ---
        
        // --- ADD THIS LOG ---
        console.log("Parsed CSV data from frontend:", data)
        // --------------------

        if (data.length === 0) {
          setMessage('Error: CSV file is empty.')
          setIsLoading(false)
          return
        }
        
        // **IMPORTANT: Updated column check to match your Drizzle schema**
        const requiredColumns = ['origin', 'destination', 'departureTime', 'status', 'isPaid']
        const fileColumns = Object.keys(data[0])
        const hasAllColumns = requiredColumns.every(col => fileColumns.includes(col))

        if (!hasAllColumns) {
          setMessage(`Error: Missing required columns. Need: ${requiredColumns.join(', ')}`)
          setIsLoading(false)
          return
        }

        // --- 2. Call Server Action ---
        setMessage('Uploading to database...')
        try {
          const response = await replaceSchedule(data)

          if (response.error) {
            throw new Error(response.error)
          }

          setMessage(`Upload successful! ${response.inserted} buses added. Refreshing...`)
          // No need for router.refresh() because the server action
          // `revalidatePath` will handle stale data.
          // We can add a manual refresh just in case.
          router.refresh() 

        } catch (error: any) {
          console.error(error)
          setMessage(`Error: ${error.message}`)
        } finally {
          setIsLoading(false)
          // Clear the message after a few seconds
          setTimeout(() => setMessage(''), 5000)
        }
      },
      error: (error: any) => {
        console.error('Papaparse error:', error)
        setMessage('Error parsing CSV file.')
        setIsLoading(false)
      }
    })
  }

  return (
    <div className="flex items-center gap-4">
      <label 
        className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
        {isLoading ? 'Uploading...' : 'Upload CSV'}
        <input 
          type="file" 
          accept=".csv" 
          className="hidden" 
          onChange={handleFileUpload}
          disabled={isLoading}
          onClick={(e) => (e.currentTarget.value = '')} 
        />
      </label>
      {message && <p className="text-sm text-gray-400">{message}</p>}
    </div>
  )
}