"use client"

import { useState, useRef, useCallback, useEffect } from "react"
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-red-600">Delivery Verification</h2>
        <p className="text-gray-600">
          Capture photos with geolocation to confirm successful deliveries
        </p>
      </div>

      {geoError && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
          {geoError}
          <Button
            variant="link"
            className="text-red-700 underline ml-2"
            onClick={() => setGeoError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Delivery List */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Pending Deliveries</CardTitle>
            <CardDescription>Select a delivery to confirm with images</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {deliveries.map((delivery) => (
              <div
                key={delivery.id}
                onClick={() => {
                  setSelectedDelivery(delivery)
                  stopCamera()
                }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedDelivery?.id === delivery.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                } ${
                  delivery.status === "delivered"
                    ? "bg-green-50 border-green-200"
                    : delivery.status === "failed"
                    ? "bg-red-50 border-red-200"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{delivery.recipientName}</p>
                    <p className="text-sm text-gray-500">ID: {delivery.deliveryId}</p>
                    <p className="text-sm text-gray-600 mt-1">{delivery.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        delivery.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : delivery.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {delivery.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
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
            ))}
          </CardContent>
        </Card>

        {/* Capture Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>
              {selectedDelivery ? selectedDelivery.recipientName : "Select a Delivery"}
            </CardTitle>
            {selectedDelivery && (
              <CardDescription>{selectedDelivery.address}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {selectedDelivery ? (
              <div className="space-y-4">
                {/* Image Capture Area */}
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((index) => {
                    const file = selectedDelivery.images[index]
                    return (
                      <div
                        key={index}
                        className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden"
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
                        ) : (
                          <Camera className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Camera Preview */}
                {capturing && (
                  <div className="relative">
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
                <div className="flex flex-wrap gap-3">
                  {!capturing ? (
                    <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700" disabled={!cameraSupported}>
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
                    Upload File
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
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <p className="font-medium mb-2">Last Capture Metadata:</p>
                    <div className="grid grid-cols-2 gap-2 text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Lat: {selectedDelivery.images[selectedDelivery.images.length - 1].latitude?.toFixed(6)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Lng: {selectedDelivery.images[selectedDelivery.images.length - 1].longitude?.toFixed(6)}
                      </div>
                      <div className="flex items-center gap-1 col-span-2">
                        <Clock className="h-4 w-4" />
                        {selectedDelivery.images[selectedDelivery.images.length - 1].timestamp.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Completion Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => markDeliveryStatus(selectedDelivery.id, "delivered")}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={selectedDelivery.images.length === 0}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Delivered
                  </Button>
                  <Button
                    onClick={() => markDeliveryStatus(selectedDelivery.id, "failed")}
                    variant="outline"
                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Failed
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Camera className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a delivery from the list to begin confirmation</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
