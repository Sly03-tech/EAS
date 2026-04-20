"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, FileSpreadsheet, History, Search } from "lucide-react"

interface FileHistory {
  id: string
  filename: string
  uploadedAt: Date
  records: number
  status: "processed" | "pending" | "error"
}

const mockHistory: FileHistory[] = [
  { id: "1", filename: "JHB_accounts_march.xlsx", uploadedAt: new Date("2026-04-15"), records: 1250, status: "processed" },
  { id: "2", filename: "PTA_batch_02.xlsx", uploadedAt: new Date("2026-04-10"), records: 890, status: "processed" },
  { id: "3", filename: "CPT_new_connections.xlsx", uploadedAt: new Date("2026-04-08"), records: 456, status: "processed" },
]

export default function FileImportPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [location, setLocation] = useState("")
  const [showHistory, setShowHistory] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith(".xlsx")) {
      setSelectedFile(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-red-600">Import Task File</h2>
        <p className="text-gray-600">
          Upload an Excel file (.xlsx) containing task information
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          {/* Location Search */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Search Project Location
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search municipality names..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Search and select the municipality for these accounts
            </p>
          </div>

          {/* File Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <Upload className="h-10 w-10 mx-auto text-gray-400 mb-4" />
            {selectedFile ? (
              <div>
                <FileSpreadsheet className="h-8 w-8 mx-auto text-green-600 mb-2" />
                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
                <Button
                  variant="link"
                  onClick={() => setSelectedFile(null)}
                  className="text-red-600"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-3">
                  Drag and drop your file here or
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Select File
                </Button>
                <p className="text-xs text-gray-500 mt-3">
                  Supported format: Excel (.xlsx)
                </p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setSelectedFile(null)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              disabled={!selectedFile || !location}
            >
              Upload & Process
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File History */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>File History</CardTitle>
            <CardDescription>
              View and manage previously uploaded files and their assigned tasks.
              Click the Refresh button to load history data.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="h-4 w-4 mr-2" />
            Show History
          </Button>
        </CardHeader>
        {showHistory && (
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Filename
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Upload Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Records
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockHistory.map((file) => (
                    <tr
                      key={file.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900 flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4 text-green-600" />
                        {file.filename}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {file.uploadedAt.toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {file.records.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {file.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
