"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Save, MapPin, Camera, Bell, Shield, Database } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    requireGps: true,
    gpsAccuracy: "high",
    minPhotos: "1",
    requireTimestamp: true,
    autoGeocode: true,
    emailNotifications: true,
    pushNotifications: false,
    taskAlerts: true,
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-red-600">Settings</h2>
        <p className="text-gray-600">Configure application preferences and requirements</p>
      </div>

      {/* GPS Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-500" />
            GPS & Location Settings
          </CardTitle>
          <CardDescription>
            Configure geolocation requirements for task verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Require GPS for photo capture</p>
              <p className="text-sm text-gray-500">
                Photos must include GPS coordinates
              </p>
            </div>
            <Switch
              checked={settings.requireGps}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, requireGps: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">GPS Accuracy Level</p>
              <p className="text-sm text-gray-500">
                Set the required accuracy for location data
              </p>
            </div>
            <Select
              value={settings.gpsAccuracy}
              onValueChange={(value) =>
                setSettings({ ...settings, gpsAccuracy: value })
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low (100m)</SelectItem>
                <SelectItem value="medium">Medium (50m)</SelectItem>
                <SelectItem value="high">High (10m)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-geocode addresses</p>
              <p className="text-sm text-gray-500">
                Automatically fetch coordinates for new addresses
              </p>
            </div>
            <Switch
              checked={settings.autoGeocode}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, autoGeocode: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Photo Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-green-500" />
            Photo Requirements
          </CardTitle>
          <CardDescription>
            Set requirements for verification photos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Minimum photos per task</p>
              <p className="text-sm text-gray-500">
                Required number of photos for task completion
              </p>
            </div>
            <Select
              value={settings.minPhotos}
              onValueChange={(value) =>
                setSettings({ ...settings, minPhotos: value })
              }
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Require timestamp overlay</p>
              <p className="text-sm text-gray-500">
                Add date/time watermark to photos
              </p>
            </div>
            <Switch
              checked={settings.requireTimestamp}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, requireTimestamp: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-yellow-500" />
            Notifications
          </CardTitle>
          <CardDescription>
            Manage how you receive alerts and updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email notifications</p>
              <p className="text-sm text-gray-500">
                Receive updates via email
              </p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, emailNotifications: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push notifications</p>
              <p className="text-sm text-gray-500">
                Receive browser push notifications
              </p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, pushNotifications: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Task assignment alerts</p>
              <p className="text-sm text-gray-500">
                Get notified when tasks are assigned
              </p>
            </div>
            <Switch
              checked={settings.taskAlerts}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, taskAlerts: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-500" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Application Version</p>
              <p className="font-medium">EAS v2.1.0</p>
            </div>
            <div>
              <p className="text-gray-500">Last Sync</p>
              <p className="font-medium">April 20, 2026 16:30</p>
            </div>
            <div>
              <p className="text-gray-500">Database Status</p>
              <p className="font-medium text-green-600">Connected</p>
            </div>
            <div>
              <p className="text-gray-500">API Status</p>
              <p className="font-medium text-green-600">Operational</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
