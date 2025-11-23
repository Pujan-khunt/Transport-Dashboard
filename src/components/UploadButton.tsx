'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import { useRouter } from 'next/navigation'
// import the specific error type so we can use it in state
import { replaceSchedule, ScheduleResponse, RowValidationError } from '@/app/actions/busActions' 

const REQUIRED_CSV_COLUMNS = ['Special', 'Source', 'Destination', 'Departure Time', 'Status', 'Is Paid']

export default function CsvUploadButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  // state to hold the list of errors if upload fails
  const [errorList, setErrorList] = useState<RowValidationError[] | null>(null)
  
  const router = useRouter()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // reset states when a new file is chosen
    setIsLoading(true)
    setMessage('Parsing file...')
    setErrorList(null)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data as any[]
        
        // check if file is empty
        if (data.length === 0 || !data[0]) {
          setMessage('Error: CSV is empty.')
          setIsLoading(false)
          return
        }
        
        // check if all columns exist
        const fileColumns = Object.keys(data[0])
        const hasAllColumns = REQUIRED_CSV_COLUMNS.every(col => fileColumns.includes(col.trim()))

        if (!hasAllColumns) {
          setMessage(`Missing columns. Need: ${REQUIRED_CSV_COLUMNS.join(', ')}`)
          setIsLoading(false)
          return
        }

        setMessage('Uploading...')
        
        try {
          const response: ScheduleResponse = await replaceSchedule(data)

          if (response.success) {
            setMessage(`Success! ${response.inserted} buses added.`)
            router.refresh() 
            // clear success message after a few seconds
            setTimeout(() => setMessage(''), 5000)
          } else {
            // handle failure
            if (response.errors && response.errors.length > 0) {
                setMessage(`Failed: ${response.errors.length} errors found.`)
                // save the errors to state so we can show them
                setErrorList(response.errors)
            } else {
                setMessage(`Error: ${response.message}`)
            }
          }

        } catch (error: any) {
          console.error("Upload error:", error)
          setMessage(`Error: ${error.message}`)
        } finally {
          setIsLoading(false)
        }
      },
      error: (error: any) => {
        console.error('Papaparse error:', error)
        setMessage('Error parsing CSV.')
        setIsLoading(false)
      }
    })
  }

  return (
    <div className="relative">
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
        {message && <p className="text-sm text-gray-500">{message}</p>}
      </div>

      {/* Error Dropdown - only shows if we have errors */}
      {errorList && errorList.length > 0 && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-red-200 shadow-xl rounded-lg z-50 overflow-hidden">
            <div className="bg-red-50 px-4 py-2 border-b border-red-100 flex justify-between items-center">
                <h3 className="text-sm font-bold text-red-800">Validation Errors</h3>
                <button 
                    onClick={() => setErrorList(null)}
                    className="text-red-500 hover:text-red-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                </button>
            </div>
            <div className="max-h-64 overflow-y-auto p-0">
                <ul className="divide-y divide-gray-100">
                    {errorList.map((err, idx) => (
                        <li key={idx} className="px-4 py-3 text-sm hover:bg-gray-50">
                            <div className="flex items-start gap-2">
                                <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 shrink-0">
                                    Row {err.row}
                                </span>
                                <span className="text-gray-600">{err.error}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      )}
    </div>
  )
}