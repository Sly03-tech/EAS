"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Truck,
  CheckCircle,
  Clock,
  Camera,
  FileUp,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import { useDeliveries } from "@/lib/deliveries-context"
import { useMemo } from "react"

export default function DashboardPage() {
  const { deliveries } = useDeliveries()

  const stats = useMemo(() => {
    const total = deliveries.length
    const delivered = deliveries.filter(d => d.status === 'delivered').length
    const pending = deliveries.filter(d => d.status === 'pending').length
    const awaitingConfirmation = deliveries.filter(d => d.status === 'in_progress' && d.images.length === 0).length

    return [
      { label: "Total Deliveries", value: total.toString(), icon: Truck, color: "bg-blue-500" },
      { label: "Delivered", value: delivered.toString(), icon: CheckCircle, color: "bg-green-500" },
      { label: "Pending", value: pending.toString(), icon: Clock, color: "bg-yellow-500" },
      { label: "Awaiting Confirmation", value: awaitingConfirmation.toString(), icon: Camera, color: "bg-red-500" },
    ]
  }, [deliveries])

  const recentDeliveries = useMemo(() => {
    return deliveries
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5)
      .map(delivery => ({
        id: delivery.deliveryId,
        recipient: delivery.recipientName,
        address: delivery.address,
        location: "JHB", // Default location for now
        status: delivery.status === 'delivered' ? 'Delivered' :
                delivery.status === 'in_progress' ? 'In Transit' :
                delivery.status === 'pending' ? 'Pending' :
                delivery.status === 'failed' ? 'Failed' : 'Cancelled',
        type: delivery.deliveryType,
        confirmed: delivery.images.length > 0,
      }))
  }, [deliveries])
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-red-600">Dashboard</h2>
        <p className="text-gray-600">Overview of delivery tracking and service confirmation</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/file-import">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <FileUp className="h-4 w-4 mr-2" />
                Import Delivery File
              </Button>
            </Link>
            <Link href="/dashboard/task-assignment">
              <Button className="bg-green-600 hover:bg-green-700">
                <Truck className="h-4 w-4 mr-2" />
                Assign Deliveries
              </Button>
            </Link>
            <Link href="/dashboard/verification">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Camera className="h-4 w-4 mr-2" />
                Verify Deliveries
              </Button>
            </Link>
            <Link href="/dashboard/task-assignment">
              <Button variant="outline">
                <MapPin className="h-4 w-4 mr-2" />
                Track Routes
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Deliveries */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Deliveries</CardTitle>
          <CardDescription>Latest delivery assignments and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Delivery ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Recipient</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Address</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Confirmed</th>
                </tr>
              </thead>
              <tbody>
                {recentDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{delivery.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{delivery.recipient}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{delivery.address}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{delivery.location}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{delivery.type}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          delivery.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : delivery.status === "Confirmed"
                            ? "bg-blue-100 text-blue-800"
                            : delivery.status === "In Transit"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {delivery.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {delivery.confirmed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
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
