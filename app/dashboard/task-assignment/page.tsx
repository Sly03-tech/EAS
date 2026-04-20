"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, MapPin, Plus, Edit, Trash2 } from "lucide-react"
import { useDeliveries } from "@/lib/deliveries-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function DeliveryAssignmentPage() {
  const { deliveries, updateDelivery, deleteDelivery, addDelivery } = useDeliveries()
  const [selectedDeliveries, setSelectedDeliveries] = useState<string[]>([])
  const [courier, setCourier] = useState("")
  const [deliveryType, setDeliveryType] = useState("")
  const [selectAll, setSelectAll] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingDelivery, setEditingDelivery] = useState<any>(null)

  const missingGpsCount = deliveries.filter((d) => !d.latitude).length

  const toggleDelivery = (id: string) => {
    setSelectedDeliveries((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedDeliveries([])
    } else {
      setSelectedDeliveries(deliveries.map((d) => d.id))
    }
    setSelectAll(!selectAll)
  }

  const handleAssignCourier = () => {
    if (!courier) return
    selectedDeliveries.forEach(id => {
      updateDelivery(id, { courier, status: 'in_progress' })
    })
    setSelectedDeliveries([])
    setCourier("")
  }

  const handleCreateDelivery = (formData: FormData) => {
    const newDelivery = {
      deliveryId: `DEL${Date.now()}`,
      recipientName: formData.get('recipientName') as string,
      address: formData.get('address') as string,
      deliveryType: formData.get('deliveryType') as string,
      status: 'pending' as const,
      priority: formData.get('priority') as 'low' | 'medium' | 'high',
      notes: formData.get('notes') as string,
      scheduledDate: formData.get('scheduledDate') ? new Date(formData.get('scheduledDate') as string) : undefined,
      images: [],
    }
    addDelivery(newDelivery)
    setIsCreateDialogOpen(false)
  }

  const handleEditDelivery = (formData: FormData) => {
    if (!editingDelivery) return
    const updates = {
      recipientName: formData.get('recipientName') as string,
      address: formData.get('address') as string,
      deliveryType: formData.get('deliveryType') as string,
      priority: formData.get('priority') as 'low' | 'medium' | 'high',
      notes: formData.get('notes') as string,
      scheduledDate: formData.get('scheduledDate') ? new Date(formData.get('scheduledDate') as string) : undefined,
    }
    updateDelivery(editingDelivery.id, updates)
    setEditingDelivery(null)
  }

  const handleDeleteDelivery = (id: string) => {
    if (confirm('Are you sure you want to delete this delivery?')) {
      deleteDelivery(id)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-red-600">Delivery Assignment</h2>
        <p className="text-gray-600">
          Assign deliveries to couriers. Deliveries with missing GPS data will be highlighted in yellow.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="flex flex-wrap items-center gap-6 text-sm">
        <div>
          <span className="text-gray-500">Selected Deliveries:</span>
          <p className="font-semibold">{selectedDeliveries.length} of {deliveries.length}</p>
        </div>
        <div>
          <span className="text-gray-500">Location:</span>
          <p className="font-semibold">JHB</p>
        </div>
        <div>
          <span className="text-gray-500">Missing GPS Data:</span>
          <p className="font-semibold text-green-600">{missingGpsCount} deliveries</p>
        </div>
        <Button variant="outline" size="sm" className="ml-auto">
          <Search className="h-4 w-4 mr-2" />
          Auto-Geocode
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-sm text-gray-500 block mb-2">Courier</label>
              <Select value={courier} onValueChange={setCourier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Courier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-doe">John Doe</SelectItem>
                  <SelectItem value="jane-smith">Jane Smith</SelectItem>
                  <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                  <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400 mt-1">Assign deliveries to this courier</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-2">Delivery Type</label>
              <Select value={deliveryType} onValueChange={setDeliveryType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="package">Package</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="supplies">Supplies</SelectItem>
                  <SelectItem value="notice">Notice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Apply to Selected
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              Confirm Assignment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox checked={selectAll} onCheckedChange={toggleSelectAll} />
              <span className="text-sm font-medium">Select All</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {missingGpsCount} missing GPS
              </span>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {selectedDeliveries.length} deliveries selected
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="w-10 py-3 px-2"></th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Delivery ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Recipient</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Address</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Lat</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Lng</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((delivery) => (
                  <tr
                    key={delivery.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 ${
                      !delivery.latitude ? "bg-yellow-50" : ""
                    }`}
                  >
                    <td className="py-3 px-2">
                      <Checkbox
                        checked={selectedDeliveries.includes(delivery.id)}
                        onCheckedChange={() => toggleDelivery(delivery.id)}
                      />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{delivery.deliveryId}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{delivery.recipientName}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{delivery.address}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{delivery.address}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{delivery.latitude || "N/A"}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{delivery.longitude || "N/A"}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{delivery.deliveryType}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {delivery.status}
                      </span>
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
