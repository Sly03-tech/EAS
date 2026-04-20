"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { FileBarChart, Download, Calendar, Filter } from "lucide-react"

export default function ReportsPage() {
  const [reportType, setReportType] = useState("")
  const [dateRange, setDateRange] = useState({ from: "", to: "" })
  const [location, setLocation] = useState("")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-red-600">Reports</h2>
        <p className="text-gray-600">
          Generate and download custom reports for task management
        </p>
      </div>

      {/* Report Filters */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Filters
          </CardTitle>
          <CardDescription>
            Configure your report parameters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Report Type
              </label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task-summary">Task Summary</SelectItem>
                  <SelectItem value="completion-rate">Completion Rate</SelectItem>
                  <SelectItem value="gps-verification">GPS Verification</SelectItem>
                  <SelectItem value="user-performance">User Performance</SelectItem>
                  <SelectItem value="location-analysis">Location Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Location
              </label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="jhb">Johannesburg</SelectItem>
                  <SelectItem value="pta">Pretoria</SelectItem>
                  <SelectItem value="cpt">Cape Town</SelectItem>
                  <SelectItem value="dbn">Durban</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                From Date
              </label>
              <Input
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange({ ...dateRange, from: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                To Date
              </label>
              <Input
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange({ ...dateRange, to: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline">Reset</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileBarChart className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: "Daily Task Summary",
            description: "Overview of tasks completed today",
            icon: Calendar,
          },
          {
            title: "Weekly Performance",
            description: "Team performance metrics for the week",
            icon: FileBarChart,
          },
          {
            title: "GPS Compliance",
            description: "Tasks with verified GPS coordinates",
            icon: FileBarChart,
          },
        ].map((report) => (
          <Card key={report.title} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <report.icon className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-4 w-full">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Reports */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Report Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Generated
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "JHB_April_Summary.pdf", type: "Task Summary", date: "2026-04-19" },
                  { name: "Weekly_Performance_W15.pdf", type: "Performance", date: "2026-04-15" },
                  { name: "GPS_Compliance_March.pdf", type: "GPS Verification", date: "2026-04-01" },
                ].map((report, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{report.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{report.type}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{report.date}</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
