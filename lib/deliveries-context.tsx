"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CapturedFile {
  url: string
  type: 'image' | 'pdf' | 'other'
  timestamp: Date
  latitude: number | null
  longitude: number | null
}

export interface Delivery {
  id: string
  deliveryId: string
  recipientName: string
  address: string
  deliveryType: string
  status: 'pending' | 'in_progress' | 'delivered' | 'failed' | 'cancelled'
  courier?: string
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
  updatedAt: Date
  scheduledDate?: Date
  notes?: string
  images: CapturedFile[]
  latitude?: number
  longitude?: number
}

interface DeliveriesContextType {
  deliveries: Delivery[]
  addDelivery: (delivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateDelivery: (id: string, updates: Partial<Delivery>) => void
  deleteDelivery: (id: string) => void
  getDeliveryById: (id: string) => Delivery | undefined
  getDeliveriesByStatus: (status: Delivery['status']) => Delivery[]
  getDeliveriesByCourier: (courier: string) => Delivery[]
}

const DeliveriesContext = createContext<DeliveriesContextType | undefined>(undefined)

const initialDeliveries: Delivery[] = [
  {
    id: '1',
    deliveryId: 'DEL001',
    recipientName: 'John Karani',
    address: '139 MAIN ROAD, RACECO...',
    deliveryType: 'Package',
    status: 'delivered',
    courier: 'John Doe',
    priority: 'medium',
    createdAt: new Date('2026-04-15'),
    updatedAt: new Date('2026-04-19'),
    scheduledDate: new Date('2026-04-18'),
    notes: 'Delivered successfully',
    images: [],
    latitude: -26.2041,
    longitude: 28.0473,
  },
  {
    id: '2',
    deliveryId: 'DEL002',
    recipientName: 'Sarah Khumalo',
    address: '15 ROSINA ROAD, TURF CL...',
    deliveryType: 'Document',
    status: 'pending',
    priority: 'high',
    createdAt: new Date('2026-04-18'),
    updatedAt: new Date('2026-04-18'),
    scheduledDate: new Date('2026-04-20'),
    notes: 'Urgent legal documents',
    images: [],
  },
  {
    id: '3',
    deliveryId: 'DEL003',
    recipientName: 'ABC Corp',
    address: '334 JULES STREET, MALV...',
    deliveryType: 'Equipment',
    status: 'in_progress',
    courier: 'Jane Smith',
    priority: 'low',
    createdAt: new Date('2026-04-17'),
    updatedAt: new Date('2026-04-19'),
    scheduledDate: new Date('2026-04-21'),
    notes: 'Heavy equipment - requires assistance',
    images: [],
  },
  {
    id: '4',
    deliveryId: 'DEL004',
    recipientName: 'XYZ Industries',
    address: '31 LAKEWOOD TERRACE R...',
    deliveryType: 'Supplies',
    status: 'delivered',
    courier: 'Mike Johnson',
    priority: 'medium',
    createdAt: new Date('2026-04-16'),
    updatedAt: new Date('2026-04-18'),
    scheduledDate: new Date('2026-04-19'),
    notes: 'Office supplies delivery',
    images: [],
    latitude: -26.246468,
    longitude: 28.039318,
  },
  {
    id: '5',
    deliveryId: 'DEL005',
    recipientName: 'Lothlorien Ltd',
    address: '5 KRUGER STREET, CITY A...',
    deliveryType: 'Notice',
    status: 'failed',
    courier: 'Sarah Wilson',
    priority: 'high',
    createdAt: new Date('2026-04-14'),
    updatedAt: new Date('2026-04-17'),
    scheduledDate: new Date('2026-04-16'),
    notes: 'Recipient not available - will retry tomorrow',
    images: [],
  },
]

export function DeliveriesProvider({ children }: { children: ReactNode }) {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])

  useEffect(() => {
    // Load from localStorage or use initial data
    const saved = localStorage.getItem('deliveries')
    if (saved) {
      const parsed = JSON.parse(saved)
      // Convert date strings back to Date objects
      const deliveriesWithDates = parsed.map((d: any) => ({
        ...d,
        createdAt: new Date(d.createdAt),
        updatedAt: new Date(d.updatedAt),
        scheduledDate: d.scheduledDate ? new Date(d.scheduledDate) : undefined,
      }))
      setDeliveries(deliveriesWithDates)
    } else {
      setDeliveries(initialDeliveries)
    }
  }, [])

  useEffect(() => {
    // Save to localStorage whenever deliveries change
    localStorage.setItem('deliveries', JSON.stringify(deliveries))
  }, [deliveries])

  const addDelivery = (deliveryData: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDelivery: Delivery = {
      ...deliveryData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setDeliveries(prev => [...prev, newDelivery])
  }

  const updateDelivery = (id: string, updates: Partial<Delivery>) => {
    setDeliveries(prev =>
      prev.map(delivery =>
        delivery.id === id
          ? { ...delivery, ...updates, updatedAt: new Date() }
          : delivery
      )
    )
  }

  const deleteDelivery = (id: string) => {
    setDeliveries(prev => prev.filter(delivery => delivery.id !== id))
  }

  const getDeliveryById = (id: string) => {
    return deliveries.find(delivery => delivery.id === id)
  }

  const getDeliveriesByStatus = (status: Delivery['status']) => {
    return deliveries.filter(delivery => delivery.status === status)
  }

  const getDeliveriesByCourier = (courier: string) => {
    return deliveries.filter(delivery => delivery.courier === courier)
  }

  return (
    <DeliveriesContext.Provider value={{
      deliveries,
      addDelivery,
      updateDelivery,
      deleteDelivery,
      getDeliveryById,
      getDeliveriesByStatus,
      getDeliveriesByCourier,
    }}>
      {children}
    </DeliveriesContext.Provider>
  )
}

export function useDeliveries() {
  const context = useContext(DeliveriesContext)
  if (context === undefined) {
    throw new Error('useDeliveries must be used within a DeliveriesProvider')
  }
  return context
}