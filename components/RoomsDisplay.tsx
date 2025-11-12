"use client"

import { useState, useEffect, useMemo } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { motion, AnimatePresence } from "framer-motion"
import { Filter,  AlertCircle,  } from "lucide-react"

import { RoomCard } from "./RoomCard"
import { RoomsSkeletonGrid } from "./RoomsSkeletonGrid"

// Room type definition based on your Firebase structure
interface Room {
  id: string
  name: string
  price: number
  description: string
  rating: number
  totalReviews: number
  amenities: string[]
  status: "available" | "occupied" | "maintenance"
  images: string[]
  createdAt: any
  updatedAt: any
}

interface RoomsDisplayProps {
  showFilters?: boolean
  limit?: number
  layout?: "grid" | "list"
  columns?: number,
}

export function RoomsDisplay({
  showFilters = true,
  limit,
  layout = "grid"
  , columns = 3
}: RoomsDisplayProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [sortBy, setSortBy] = useState("featured")

  // Fetch rooms from Firebase
  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    setLoading(true)
    setError(null)

    try {
      const roomsRef = collection(db, "rooms")
      const q = query(roomsRef, orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)

      const roomsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Room[]

      setRooms(roomsData)
    } catch (err) {
      console.error("Error fetching rooms:", err)
      setError("Failed to load rooms. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort rooms
  const filteredRooms = useMemo(() => {
    let filtered = rooms

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter((room) => room.status === selectedStatus)
    }

    // Filter by price range
    filtered = filtered.filter(
      (room) => room.price >= priceRange[0] && room.price <= priceRange[1]
    )

    // Sort rooms
    if (sortBy === "price-low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating)
    }

    // Apply limit if specified
    if (limit) {
      filtered = filtered.slice(0, limit)
    }

    return filtered
  }, [rooms, selectedStatus, priceRange, sortBy, limit])

  // Loading state: return early to avoid rendering JSX expression outside of render
  if (loading) {
    return <RoomsSkeletonGrid />
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-6"
        >
          <AlertCircle className="w-12 h-12 text-tyco-red mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-tyco-navy mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={fetchRooms} className="btn-primary">
            Try Again
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1"
        >
          <div className="backdrop-blur-xl bg-white/60 border border-white/20 rounded-3xl p-6 shadow-xl sticky top-24">
            <h3 className="text-xl font-bold text-tyco-navy mb-6 flex items-center gap-2">
              <Filter className="w-5 h-5 text-tyco-red" />
              Filters
            </h3>

            {/* Room Status Filter */}
            <div className="mb-8">
              <h4 className="font-semibold text-tyco-navy mb-4">Availability</h4>
              <div className="space-y-3">
                {[
                  { value: null, label: "All Rooms" },
                  { value: "available", label: "Available" },
                  { value: "occupied", label: "Occupied" },
                  { value: "maintenance", label: "Maintenance" },
                ].map((status) => (
                  <motion.label
                    key={status.value || "all"}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="room-status"
                      value={status.value || ""}
                      checked={selectedStatus === status.value}
                      onChange={() => setSelectedStatus(status.value)}
                      className="w-4 h-4 accent-tyco-red"
                    />
                    <span className="text-gray-700 group-hover:text-tyco-navy transition-colors font-medium">
                      {status.label}
                    </span>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-8">
              <h4 className="font-semibold text-tyco-navy mb-4">Price Range</h4>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-tyco-red"
                />
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-tyco-navy">GH₵{priceRange[0]}</span>
                  <span className="text-tyco-red">GH₵{priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h4 className="font-semibold text-tyco-navy mb-4">Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tyco-red focus:border-transparent transition-all font-medium text-gray-700"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Rooms Grid */}
      <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex justify-between items-center"
        >
          <p className="text-gray-600 font-medium">
            Showing{" "}
            <span className="font-bold text-tyco-navy">
              {filteredRooms.length}
            </span>{" "}
            {filteredRooms.length === 1 ? "room" : "rooms"}
          </p>
        </motion.div>

        {filteredRooms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <p className="text-xl text-gray-600 mb-4">
              No rooms found matching your criteria
            </p>
            <button
              onClick={() => {
                setSelectedStatus(null)
                setPriceRange([0, 2000])
              }}
              className="btn-primary"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
         <div
  className={
    layout === "grid"
      ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`
      : "space-y-6"
  }
>


            <AnimatePresence mode="popLayout">
              {filteredRooms.map((room, index) => (
                <RoomCard key={room.id} room={room} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

