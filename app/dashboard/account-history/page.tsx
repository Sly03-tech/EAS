"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, MapPin, Calendar, Image, Eye } from "lucide-react"
import { useDeliveries } from "@/lib/deliveries-context"

export default function DeliveryHistoryPage() {
  const { deliveries } = useDeliveries()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRecord, setSelectedRecord] = useState<any>(null)

  const filteredData = useMemo(() => {
    return deliveries
      .filter(d => d.status === 'delivered' || d.status === 'failed')
      .filter((item) => {
        const matchesSearch =
          item.deliveryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.recipientName.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus =
          statusFilter === "all" || item.status === statusFilter
        return matchesSearch && matchesStatus
      })
      .map(delivery => ({
        id: delivery.id,
        deliveryId: delivery.deliveryId,
        recipientName: delivery.recipientName,
        address: delivery.address,
        deliveryType: delivery.deliveryType,
        completedAt: delivery.updatedAt.toLocaleString(),
        status: delivery.status,
        courier: delivery.courier || 'Unknown',
        gpsCoords: delivery.latitude && delivery.longitude ? `${delivery.latitude}, ${delivery.longitude}` : 'N/A',
        images: delivery.images.length,
        imagesData: delivery.images,
      }))
  }, [deliveries, searchTerm, statusFilter])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-red-600">Delivery History</h2>
        <p className="text-gray-600">
          View completed deliveries with confirmation photos and GPS data
        </p>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by delivery ID or recipient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-[180px]">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* History Table */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Delivery History</CardTitle>
            <CardDescription>
              {filteredData.length} records found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Delivery ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Recipient</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        selectedRecord?.id === item.id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => setSelectedRecord(item)}
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">{item.deliveryId}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{item.recipientName}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{item.deliveryType}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{item.completedAt}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Detail Panel */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Delivery Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRecord ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Recipient</p>
                  <p className="font-medium">{selectedRecord.recipientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery ID</p>
                  <p className="font-medium">{selectedRecord.deliveryId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{selectedRecord.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivery Type</p>
                  <p className="font-medium">{selectedRecord.deliveryType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Courier</p>
                  <p className="font-medium">{selectedRecord.courier}</p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">GPS Coordinates</p>
                    <p className="font-medium text-sm">{selectedRecord.gpsCoords}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Delivered At</p>
                    <p className="font-medium text-sm">{selectedRecord.completedAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Confirmation Photos</p>
                    <p className="font-medium text-sm">{selectedRecord.images} images</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">Photos</p>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: selectedRecord.images }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
                      >
                        <Image className="h-6 w-6 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a record to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
