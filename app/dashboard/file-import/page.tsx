"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, FileSpreadsheet, History, Search, X, CheckCircle, MapPin, FileImage, File } from "lucide-react"

// ── Mock municipality data ──────────────────────────────────────────────────
const MUNICIPALITIES = [
  { id: "JHB", name: "City of Johannesburg", province: "Gauteng" },
  { id: "TSH", name: "City of Tshwane", province: "Gauteng" },
  { id: "EKU", name: "Ekurhuleni Metropolitan", province: "Gauteng" },
  { id: "CPT", name: "City of Cape Town", province: "Western Cape" },
  { id: "ETH", name: "eThekwini Metropolitan", province: "KwaZulu-Natal" },
  { id: "NMB", name: "Nelson Mandela Bay", province: "Eastern Cape" },
  { id: "BUF", name: "Buffalo City Metropolitan", province: "Eastern Cape" },
  { id: "MAN", name: "Mangaung Metropolitan", province: "Free State" },
  { id: "SOL", name: "Sol Plaatje Local", province: "Northern Cape" },
  { id: "POL", name: "Polokwane Local", province: "Limpopo" },
  { id: "MBM", name: "Mbombela Local", province: "Mpumalanga" },
  { id: "RUS", name: "Rustenburg Local", province: "North West" },
  { id: "EMF", name: "Emfuleni Local", province: "Gauteng" },
  { id: "KWD", name: "KwaDukuza Local", province: "KwaZulu-Natal" },
  { id: "UMH", name: "uMhlathuze Local", province: "KwaZulu-Natal" },
  { id: "GEO", name: "George Local", province: "Western Cape" },
  { id: "DTY", name: "Drakenstein Local", province: "Western Cape" },
  { id: "STL", name: "Stellenbosch Local", province: "Western Cape" },
  { id: "MSU", name: "Msunduzi Local", province: "KwaZulu-Natal" },
  { id: "LIM", name: "Lim Waterberg District", province: "Limpopo" },
]

interface UploadedFile {
  id: string
  filename: string
  size: number
  type: string
  uploadedAt: Date
  municipality: string
  status: "processed" | "pending" | "error"
  previewUrl?: string
}

const mockHistory: UploadedFile[] = [
  { id: "1", filename: "JHB_accounts_march.xlsx", size: 245760, type: "spreadsheet", uploadedAt: new Date("2026-04-15"), municipality: "City of Johannesburg", status: "processed" },
  { id: "2", filename: "PTA_batch_02.xlsx", size: 189440, type: "spreadsheet", uploadedAt: new Date("2026-04-10"), municipality: "City of Tshwane", status: "processed" },
  { id: "3", filename: "CPT_new_connections.xlsx", size: 98304, type: "spreadsheet", uploadedAt: new Date("2026-04-08"), municipality: "City of Cape Town", status: "processed" },
]

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return <FileImage className="h-4 w-4 text-blue-500" />
  if (type.includes("spreadsheet") || type.includes("excel") || type === "spreadsheet")
    return <FileSpreadsheet className="h-4 w-4 text-green-600" />
  return <File className="h-4 w-4 text-gray-500" />
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileImportPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMunicipality, setSelectedMunicipality] = useState<typeof MUNICIPALITIES[0] | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showHistory, setShowHistory] = useState(true)
  const [history, setHistory] = useState<UploadedFile[]>(mockHistory)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  const filteredMunicipalities = MUNICIPALITIES.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) applyFiles(files)
  }

  const applyFiles = (files: File[]) => {
    const newFiles = [...selectedFiles, ...files]
    setSelectedFiles(newFiles)
    setUploadSuccess(false)
    
    // Create preview URLs for new image files
    const newPreviewUrls = { ...previewUrls }
    files.forEach(file => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file)
        newPreviewUrls[file.name + file.size] = url
      }
    })
    setPreviewUrls(newPreviewUrls)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) applyFiles(files)
    // reset input so same file can be re-selected
    e.target.value = ""
  }

  const handleRemoveFile = (fileToRemove: File) => {
    const fileKey = fileToRemove.name + fileToRemove.size
    if (previewUrls[fileKey]) {
      URL.revokeObjectURL(previewUrls[fileKey])
      const newPreviewUrls = { ...previewUrls }
      delete newPreviewUrls[fileKey]
      setPreviewUrls(newPreviewUrls)
    }
    setSelectedFiles(prev => prev.filter(f => f !== fileToRemove))
  }

  const handleRemoveAllFiles = () => {
    // Clean up all preview URLs
    Object.values(previewUrls).forEach(url => URL.revokeObjectURL(url))
    setPreviewUrls({})
    setSelectedFiles([])
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0 || !selectedMunicipality) return
    setUploading(true)

    // Simulate async upload
    await new Promise((r) => setTimeout(r, 1200))

    const newEntries: UploadedFile[] = selectedFiles.map(file => {
      const fileKey = file.name + file.size
      return {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        filename: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        uploadedAt: new Date(),
        municipality: selectedMunicipality.name,
        status: "processed" as const,
        previewUrl: previewUrls[fileKey],
      }
    })

    setHistory((prev) => [...newEntries, ...prev])
    setUploading(false)
    setUploadSuccess(true)
    
    // Clean up
    Object.values(previewUrls).forEach(url => URL.revokeObjectURL(url))
    setPreviewUrls({})
    setSelectedFiles([])
    setSelectedMunicipality(null)
    setSearchQuery("")
  }

  const handleCancel = () => {
    handleRemoveAllFiles()
    setSelectedMunicipality(null)
    setSearchQuery("")
    setUploadSuccess(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-red-600">Import Task File</h2>
        <p className="text-gray-600">
          Upload an Excel file (.xlsx) or image containing task information
        </p>
      </div>

      {uploadSuccess && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
          <span className="text-sm font-medium">File uploaded and processed successfully.</span>
          <button onClick={() => setUploadSuccess(false)} className="ml-auto text-green-600 hover:text-green-800">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">

          {/* ── Municipality Search ── */}
          <div className="mb-6" ref={searchRef}>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Search Project Location
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                placeholder="Search municipality names..."
                value={selectedMunicipality ? selectedMunicipality.name : searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSelectedMunicipality(null)
                  setShowDropdown(true)
                }}
                onFocus={() => setShowDropdown(true)}
                className="pl-10 pr-10"
              />
              {(selectedMunicipality || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedMunicipality(null)
                    setSearchQuery("")
                    setShowDropdown(false)
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Dropdown */}
              {showDropdown && !selectedMunicipality && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                  {filteredMunicipalities.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">No municipalities found</div>
                  ) : (
                    filteredMunicipalities.map((m) => (
                      <button
                        key={m.id}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSelectedMunicipality(m)
                          setSearchQuery("")
                          setShowDropdown(false)
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-0"
                      >
                        <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{m.name}</p>
                          <p className="text-xs text-gray-500">{m.province}</p>
                        </div>
                        <span className="ml-auto text-xs text-gray-400 font-mono">{m.id}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            {selectedMunicipality ? (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {selectedMunicipality.name} — {selectedMunicipality.province}
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                Search and select the municipality for these accounts
              </p>
            )}
          </div>

          {/* ── File Drop Zone ── */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => selectedFiles.length === 0 && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : selectedFiles.length > 0
                ? "border-green-400 bg-green-50"
                : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
            }`}
          >
            {selectedFiles.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                  </h4>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                    >
                      Add More
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); handleRemoveAllFiles() }}
                      className="text-red-600 hover:text-red-700"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                  {selectedFiles.map((file, index) => {
                    const fileKey = file.name + file.size
                    const preview = previewUrls[fileKey]
                    return (
                      <div key={index} className="relative border border-gray-200 rounded-lg p-3 bg-white">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemoveFile(file) }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        
                        {preview ? (
                          <img
                            src={preview}
                            alt={file.name}
                            className="w-full h-20 object-cover rounded mb-2"
                          />
                        ) : (
                          <div className="w-full h-20 flex items-center justify-center bg-gray-100 rounded mb-2">
                            {getFileIcon(file.type)}
                          </div>
                        )}
                        
                        <p className="text-xs font-medium text-gray-900 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-3">Drag and drop your files here or</p>
                <Button
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Select Files
                </Button>
                <p className="text-xs text-gray-500 mt-3">
                  Supported formats: Excel (.xlsx), Images (.jpg, .png, .pdf) and more
                </p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".xlsx,.xls,.csv,.pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* ── Actions ── */}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={handleCancel} disabled={uploading}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 min-w-[140px]"
              disabled={selectedFiles.length === 0 || !selectedMunicipality || uploading}
              onClick={handleUpload}
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Processing…
                </span>
              ) : (
                `Upload ${selectedFiles.length > 0 ? `${selectedFiles.length} File${selectedFiles.length !== 1 ? 's' : ''}` : '& Process'}`
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── File History ── */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>File History</CardTitle>
            <CardDescription>
              Previously uploaded files and their assigned municipalities.
            </CardDescription>
          </div>
          <Button variant="outline" onClick={() => setShowHistory(!showHistory)}>
            <History className="h-4 w-4 mr-2" />
            {showHistory ? "Hide History" : "Show History"}
          </Button>
        </CardHeader>
        {showHistory && (
          <CardContent>
            {history.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">No files uploaded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Filename</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Municipality</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Upload Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Size</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((file) => (
                      <tr key={file.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            {getFileIcon(file.type)}
                            <span className="truncate max-w-[200px]">{file.filename}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            {file.municipality}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {file.uploadedAt.toISOString().split('T')[0]}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatBytes(file.size)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            file.status === "processed"
                              ? "bg-green-100 text-green-800"
                              : file.status === "error"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {file.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
