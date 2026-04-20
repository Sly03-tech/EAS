"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Truck, CheckCircle, MapPin, Camera } from "lucide-react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard after a brief delay to show the landing page
    const timer = setTimeout(() => {
      router.push("/dashboard")
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">EAS</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EAS Portal</h1>
          <p className="text-gray-600">Delivery Tracking System</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="text-center p-4">
            <Truck className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Track Deliveries</p>
          </div>
          <div className="text-center p-4">
            <Camera className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Photo Verification</p>
          </div>
          <div className="text-center p-4">
            <MapPin className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">GPS Location</p>
          </div>
          <div className="text-center p-4">
            <CheckCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Proof of Delivery</p>
          </div>
        </div>

        {/* Loading */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <p className="text-sm text-gray-500 mt-4">Loading dashboard...</p>
      </div>
    </div>
  )
}
