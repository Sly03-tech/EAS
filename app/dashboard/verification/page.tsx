"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, CheckCircle, XCircle, MapPin, Clock, Upload, FileText } from "lucide-react"
import { useDeliveries } from "@/lib/deliveries-context"

export default function VerificationPage() {
  const { deliveries, updateDelivery } = useDeliveries()
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null)
  const [capturing, setCapturing] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraSupported, setCameraSupported] = useState(true)
  const [stream, setStream] = useState<MediaStream | null>(null)

  // Check camera support on mount
  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraSupported(false)
    }
  }, [])

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"))
        return
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          reject(error)
        },
        { enableHighAccuracy: true, timeout: 10000 }
      )
    })
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setCapturing(true)
    } catch (error) {
      console.error("Camera error:", error)
      setGeoError("Could not access camera")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    setCapturing(false)
  }

  const capturePhoto = async () => {
    if (!videoRef.current || !selectedDelivery) return

    try {
      const location = await getCurrentLocation()
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0)
        const imageUrl = canvas.toDataURL("image/jpeg")

        const newImage = {
          url: imageUrl,
          type: 'image',
          timestamp: new Date(),
          latitude: location.lat,
          longitude: location.lng,
        }

        updateDelivery(selectedDelivery.id, { images: [...selectedDelivery.images, newImage] })
        setSelectedDelivery((prev) =>
          prev ? { ...prev, images: [...prev.images, newImage] } : null
        )
      }
    } catch (error) {
      setGeoError("Could not get location. Please enable GPS.")
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !selectedDelivery) return

    try {
      const location = await getCurrentLocation()
      const reader = new FileReader()
      reader.onload = (e) => {
        const fileUrl = e.target?.result as string
        const fileType = file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'other'
        const newFile = {
          url: fileUrl,
          type: fileType,
          timestamp: new Date(),
          latitude: location.lat,
          longitude: location.lng,
        }

        updateDelivery(selectedDelivery.id, { images: [...selectedDelivery.images, newFile] })
        setSelectedDelivery((prev) =>
          prev ? { ...prev, images: [...prev.images, newFile] } : null
        )
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setGeoError("Could not get location. Please enable GPS.")
    }
  }

  const markDeliveryStatus = (deliveryId: string, status: "delivered" | "failed") => {
    updateDelivery(deliveryId, { status })
    setSelectedDelivery(null)
    stopCamera()
  }

  // Filter for pending and in_progress deliveries only
  const pendingDeliveries = deliveries.filter(d => d.status === 'pending' || d.status === 'in_progress')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
        {/* Left Panel - Delivery List */}
        <div className="bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Pending Deliveries</h2>
            <p className="text-sm text-gray-600 mt-1">Select a delivery to confirm with images</p>
          </div>
          
          <div className="p-4 space-y-3">
            {pendingDeliveries.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">📦</div>
                <p className="text-lg font-medium">No pending deliveries</p>
                <p className="text-sm">All deliveries have been completed</p>
              </div>
            ) : (
              pendingDeliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  onClick={() => {
                    setSelectedDelivery(delivery)
                    stopCamera()
                  }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                    selectedDelivery?.id === delivery.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{delivery.recipientName}</h3>
                      <p className="text-sm text-gray-500">ID: {delivery.deliveryId}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        delivery.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {delivery.status === "pending" ? "pending" : "in_progress"}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{delivery.address}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {delivery.deliveryType}
                    </span>
                    {delivery.images.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {delivery.images.length} photo(s)
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Capture Section */}
        <div className="bg-gray-50 overflow-y-auto">
          {selectedDelivery ? (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">{selectedDelivery.recipientName}</h2>
                <p className="text-sm text-gray-600">{selectedDelivery.address}</p>
              </div>

              {geoError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {geoError}
                  <Button
                    variant="link"
                    className="text-red-700 underline ml-2 p-0 h-auto"
                    onClick={() => setGeoError(null)}
                  >
                    Dismiss
                  </Button>
                </div>
              )}

              {/* Capture Section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Capture 1</h3>
                
                {/* Image Capture Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[0, 1, 2].map((index) => {
                    const file = selectedDelivery.images[index]
                    return (
                      <div
                        key={index}
                        className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white overflow-hidden"
                      >
                        {file ? (
                          file.type === 'pdf' ? (
                            <FileText className="h-8 w-8 text-red-500" />
                          ) : (
                            <img
                              src={file.url}
                              alt={`Capture ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          )
                        ) : index === 0 ? (
                          <Camera className="h-8 w-8 text-blue-500" />
                        ) : (
                          <Camera className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Camera Preview */}
                {capturing && (
                  <div className="relative mb-6">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg bg-black"
                    />
                    <Button
                      onClick={capturePhoto}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-gray-900 hover:bg-gray-100"
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      Capture
                    </Button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mb-6">
                  {!capturing ? (
                    <Button 
                      onClick={startCamera} 
                      className="bg-blue-600 hover:bg-blue-700" 
                      disabled={!cameraSupported}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {cameraSupported ? 'Open Camera' : 'Camera Not Supported'}
                    </Button>
                  ) : (
                    <Button onClick={stopCamera} variant="outline">
                      Close Camera
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>

                {/* GPS Info */}
                {selectedDelivery.images.length > 0 && (
                  <div className="bg-white border border-gray-200 p-4 rounded-lg mb-6">
                    <p className="font-medium text-gray-900 mb-2">Last Capture Metadata:</p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>Lat: {selectedDelivery.images[selectedDelivery.images.length - 1].latitude?.toFixed(6)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>Lng: {selectedDelivery.images[selectedDelivery.images.length - 1].longitude?.toFixed(6)}</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <Clock className="h-4 w-4" />
                        <span>{selectedDelivery.images[selectedDelivery.images.length - 1].timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Completion Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => markDeliveryStatus(selectedDelivery.id, "delivered")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={selectedDelivery.images.length === 0}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Delivered
                  </Button>
                  <Button
                    onClick={() => markDeliveryStatus(selectedDelivery.id, "failed")}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Failed
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center text-gray-500">
              <div>
                <Camera className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Select a delivery to begin confirmation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}