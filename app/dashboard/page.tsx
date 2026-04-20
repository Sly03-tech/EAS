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
  AlertTriangle,
  TrendingUp,
  Users,
  Package,
} from "lucide-react"
import Link from "next/link"
import { useDeliveries } from "@/lib/deliveries-context"
import { useMemo, useState, useEffect } from "react"

// Mock additional data for enhanced dashboard
const mockPerformanceData = {
  todayDeliveries: 23,
  weeklyTarget: 150,
  completionRate: 94.2,
  avgDeliveryTime: "2.4 hours",
  activeCouriers: 8,
  totalRoutes: 12,
}

const mockAlerts = [
  { id: 1, type: "warning", message: "3 deliveries overdue in Johannesburg area", time: "10 min ago" },
  { id: 2, type: "info", message: "New batch of 15 deliveries imported", time: "25 min ago" },
  { id: 3, type: "success", message: "Route optimization completed for Pretoria", time: "1 hour ago" },
]

const mockTopLocations = [
  { name: "Johannesburg", deliveries: 45, percentage: 32 },
  { name: "Pretoria", deliveries: 28, percentage: 20 },
  { name: "Cape Town", deliveries: 22, percentage: 16 },
  { name: "Durban", deliveries: 18, percentage: 13 },
  { name: "Other", deliveries: 27, percentage: 19 },
]

export default function DashboardPage() {
  const { deliveries } = useDeliveries()
  const [currentTime, setCurrentTime] = useState<string>("")

  // Update time on client side only
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString())
    }
    
    updateTime() // Set initial time
    const interval = setInterval(updateTime, 1000) // Update every second
    
    return () => clearInterval(interval)
  }, [])

  const stats = useMemo(() => {
    const total = deliveries.length
    const delivered = deliveries.filter(d => d.status === 'delivered').length
    const pending = deliveries.filter(d => d.status === 'pending').length
    const inProgress = deliveries.filter(d => d.status === 'in_progress').length
    const failed = deliveries.filter(d => d.status === 'failed').length
    const awaitingConfirmation = deliveries.filter(d => d.status === 'in_progress' && d.images.length === 0).length

    return [
      { label: "Total Deliveries", value: total.toString(), icon: Package, color: "bg-blue-500", change: "+12%" },
      { label: "Delivered Today", value: delivered.toString(), icon: CheckCircle, color: "bg-green-500", change: "+8%" },
      { label: "In Progress", value: inProgress.toString(), icon: Truck, color: "bg-yellow-500", change: "+3%" },
      { label: "Pending Verification", value: awaitingConfirmation.toString(), icon: Camera, color: "bg-purple-500", change: "-5%" },
    ]
  }, [deliveries])

  const recentDeliveries = useMemo(() => {
    return deliveries
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 8)
      .map(delivery => ({
        id: delivery.deliveryId,
        recipient: delivery.recipientName,
        address: delivery.address.length > 30 ? delivery.address.substring(0, 30) + "..." : delivery.address,
        location: delivery.address.includes("JHB") || delivery.address.includes("JOHANNESBURG") ? "JHB" :
                 delivery.address.includes("PTA") || delivery.address.includes("PRETORIA") ? "PTA" :
                 delivery.address.includes("CPT") || delivery.address.includes("CAPE") ? "CPT" :
                 delivery.address.includes("DBN") || delivery.address.includes("DURBAN") ? "DBN" : "JHB",
        status: delivery.status === 'delivered' ? 'Delivered' :
                delivery.status === 'in_progress' ? 'In Transit' :
                delivery.status === 'pending' ? 'Pending' :
                delivery.status === 'failed' ? 'Failed' : 'Cancelled',
        type: delivery.deliveryType,
        confirmed: delivery.images.length > 0,
        priority: delivery.priority,
        courier: delivery.courier || "Unassigned",
        updatedAt: delivery.updatedAt,
      }))
  }, [deliveries])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-red-600">Dashboard</h2>
          <p className="text-gray-600">Overview of delivery tracking and service confirmation</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium">{currentTime || "Loading..."}</p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-xs font-medium ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} from yesterday
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Performance Overview
            </CardTitle>
            <CardDescription>Today's delivery performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{mockPerformanceData.todayDeliveries}</p>
                <p className="text-sm text-gray-500">Today's Deliveries</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{mockPerformanceData.completionRate}%</p>
                <p className="text-sm text-gray-500">Completion Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{mockPerformanceData.avgDeliveryTime}</p>
                <p className="text-sm text-gray-500">Avg. Delivery Time</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{mockPerformanceData.activeCouriers}</p>
                <p className="text-sm text-gray-500">Active Couriers</p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Weekly Target Progress</span>
                <span className="text-sm font-medium text-gray-900">{mockPerformanceData.todayDeliveries * 7}/{mockPerformanceData.weeklyTarget}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min((mockPerformanceData.todayDeliveries * 7 / mockPerformanceData.weeklyTarget) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0</span>
                <span>{mockPerformanceData.weeklyTarget}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-500" />
              Top Locations
            </CardTitle>
            <CardDescription>Delivery distribution by area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTopLocations.map((location, index) => (
                <div key={location.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium">{location.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{location.deliveries}</p>
                    <p className="text-xs text-gray-500">{location.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Recent Alerts
            </CardTitle>
            <CardDescription>System notifications and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'warning' ? 'border-yellow-400 bg-yellow-50' :
                  alert.type === 'success' ? 'border-green-400 bg-green-50' :
                  'border-blue-400 bg-blue-50'
                }`}>
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/dashboard/file-import">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <FileUp className="h-4 w-4 mr-2" />
                  Import Files
                </Button>
              </Link>
              <Link href="/dashboard/task-assignment">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Truck className="h-4 w-4 mr-2" />
                  Assign Tasks
                </Button>
              </Link>
              <Link href="/dashboard/verification">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Camera className="h-4 w-4 mr-2" />
                  Verify Deliveries
                </Button>
              </Link>
              <Link href="/dashboard/reports">
                <Button variant="outline" className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Deliveries Table */}
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Recipient</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Address</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Courier</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Priority</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Verified</th>
                </tr>
              </thead>
              <tbody>
                {recentDeliveries.map((delivery) => (
                  <tr key={delivery.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{delivery.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{delivery.recipient}</td>
                    <td className="py-3 px-4 text-sm text-gray-600" title={delivery.address}>
                      {delivery.address}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {delivery.location}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{delivery.courier}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        delivery.priority === 'high' ? 'bg-red-100 text-red-800' :
                        delivery.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {delivery.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        delivery.status === "Delivered" ? "bg-green-100 text-green-800" :
                        delivery.status === "In Transit" ? "bg-blue-100 text-blue-800" :
                        delivery.status === "Failed" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {delivery.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {delivery.confirmed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-400" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-center">
            <Link href="/dashboard/account-history">
              <Button variant="outline">View All Deliveries</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
