"use client"

import { useState, useEffect, useMemo } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, RotateCcw, AlertCircle } from "lucide-react"

import { RoomCard } from "./RoomCard"
import { RoomsSkeletonGrid } from "./RoomsSkeletonGrid"

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
  columns?: number
}

export function RoomsDisplay({
  showFilters = true,
  limit,
  layout = "grid",
  columns = 3,
}: RoomsDisplayProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [sortBy, setSortBy] = useState("price-low")

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
        ...doc.data(),
      })) as Room[]
      setRooms(roomsData)
    } catch (err) {
      console.error("Error fetching rooms:", err)
      setError("Failed to load rooms. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filteredRooms = useMemo(() => {
    let filtered = rooms
    if (selectedStatus) {
      filtered = filtered.filter(room => room.status === selectedStatus)
    }
    filtered = filtered.filter(
      room => room.price >= priceRange[0] && room.price <= priceRange[1]
    )
    if (sortBy === "price-low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating)
    }
    if (limit) filtered = filtered.slice(0, limit)
    return filtered
  }, [rooms, selectedStatus, priceRange, sortBy, limit])

  if (loading) return <RoomsSkeletonGrid />

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
    <div className="space-y-8">
      {/* === Top Filter Bar === */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl p-4 md:p-6 shadow-xl sticky top-20 z-20"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left section - label */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-tyco-red" />
              <h3 className="text-lg font-bold text-tyco-navy">Filter Rooms</h3>
            </div>

            {/* Room status filter */}
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { value: null, label: "All" },

              ].map(status => (
                <button
                  key={status.value || "all"}
                  onClick={() => setSelectedStatus(status.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    selectedStatus === status.value
                      ? "bg-tyco-red text-white border-tyco-red"
                      : "bg-white/60 text-gray-700 border-gray-200 hover:bg-tyco-red/10"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>

            {/* Price range slider */}
            <div className="flex items-center gap-4 w-full md:max-w-sm md:flex-1">
              <div className="flex flex-col flex-1">
                <label className="text-sm font-semibold text-gray-700">
                  Max Price
                </label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange[1]}
                  onChange={e =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-tyco-red"
                />
              </div>
              <div className="text-sm font-semibold text-tyco-navy">
                GH₵{priceRange[1]}
              </div>
            </div>

            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white/80 text-gray-700 font-medium focus:ring-2 focus:ring-tyco-red focus:outline-none"
            >
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* Reset button */}
            <button
              onClick={() => {
                setSelectedStatus(null)
                setPriceRange([0, 2000])
                setSortBy("price-low")
              }}
              className="flex items-center gap-2 text-sm font-medium text-tyco-red hover:underline"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </motion.div>
      )}

      {/* === Results Info === */}
      <div className="flex justify-between items-center text-gray-600">
        <p className="font-medium">
          Showing{" "}
          <span className="font-bold text-tyco-navy">{filteredRooms.length}</span>{" "}
          {filteredRooms.length === 1 ? "room" : "rooms"}
        </p>
      </div>

      {/* === Rooms Grid/List === */}
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
              ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6 items-stretch`
              : "space-y-6"
          }
        >
          <AnimatePresence mode="popLayout">
            {filteredRooms.map((room, index) => (
              <RoomCard key={room.id} room={room} index={index} layout={layout} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}