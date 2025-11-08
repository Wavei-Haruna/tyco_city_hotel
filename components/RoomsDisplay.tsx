"use client"

import { useState, useEffect, useMemo } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, ArrowRight, Loader2, AlertCircle, Sparkles, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 animate-spin text-tyco-red mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">Loading rooms...</p>
        </motion.div>
      </div>
    )
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

// Expert-Level Room Card Component with Apple-like Design
export function RoomCard({ room, index = 0 }: { room: Room; index?: number }) {
  const [isHovered, setIsHovered] = useState(false)

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "available":
        return {
          bg: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
          text: "text-tyco-navy",
          border: "border-green-200",
          dot: "bg-green-500"
        }
      case "occupied":
        return {
          bg: "bg-gradient-to-r from-red-500/20 to-rose-500/20",
          text: "text-red-700",
          border: "border-red-200",
          dot: "bg-red-500"
        }
      case "maintenance":
        return {
          bg: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20",
          text: "text-yellow-700",
          border: "border-yellow-200",
          dot: "bg-yellow-500"
        }
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          border: "border-gray-200",
          dot: "bg-gray-500"
        }
    }
  }

  const statusConfig = getStatusConfig(room.status)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Glassmorphic Card Container */}
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative backdrop-blur-2xl bg-white/70 border border-white/20 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500"
      >
        {/* Gradient Overlay on Hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.05 : 0 }}
          className="absolute inset-0 bg-gradient-to-br from-tyco-red via-tyco-yellow to-tyco-navy pointer-events-none z-10"
        />

        {/* Image Container */}
        <div className="relative h-56 overflow-hidden">
          <motion.div
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full"
          >
            <Image
              src={room.images[0] || "/placeholder.svg"}
              alt={room.name}
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Gradient Overlay on Image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Price Badge - Top Right */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="absolute top-4 right-4 backdrop-blur-xl bg-white/90 px-4 py-2 rounded-full shadow-lg border border-white/40"
          >
            <p className="text-sm font-bold text-tyco-navy">
              GH₵{room.price.toLocaleString()}
              <span className="text-xs font-normal text-gray-600">/night</span>
            </p>
          </motion.div>

          {/* Status Badge - Top Left */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className={`absolute top-4 left-4 backdrop-blur-xl ${statusConfig.bg} border ${statusConfig.border} px-3 py-1.5 rounded-full shadow-lg  flex items-center gap-2`}
          >
            <span className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`} />
            <span className={`text-xs font-semibold ${statusConfig.text}`}>
              {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
            </span>
          </motion.div>


        </div>

        {/* Content Container */}
        <div className="p-6">
          {/* Room Name */}
          <motion.h3
            className="text-2xl font-bold text-tyco-navy mb-3 line-clamp-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            {room.name}
          </motion.h3>

          {/* Rating - Single Star with Number */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center gap-2 mb-4"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-full border border-yellow-200/50">
              <svg
                className="w-4 h-4 fill-yellow-500"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-bold text-gray-800">
                {room.rating}
              </span>
            </div>
            <span className="text-sm text-gray-500 font-medium">
              ({room.totalReviews.toLocaleString()} reviews)
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed"
          >
            {room.description}
          </motion.p>

          {/* Amenities - Compact Pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {room.amenities.slice(0, 3).map((amenity, idx) => (
              <motion.span
                key={amenity}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 + idx * 0.05 }}
                className="px-3 py-1 bg-gradient-to-r from-gray-50 to-gray-100 text-xs font-medium text-gray-700 rounded-full border border-gray-200"
              >
                {amenity}
              </motion.span>
            ))}
            {room.amenities.length > 3 && (
              <span className="px-3 py-1 bg-gradient-to-r from-tyco-red/10 to-tyco-yellow/10 text-xs font-semibold text-tyco-red rounded-full border border-tyco-red/20">
                +{room.amenities.length - 3} more
              </span>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + index * 0.1 }}
            className="flex gap-3"
          >
            <Link
              href={`/rooms/${room.id}`}
              className="flex-1"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 bg-white border-2 border-tyco-navy text-tyco-navy rounded-xl font-semibold hover:bg-tyco-navy hover:text-white transition-all duration-300 text-sm shadow-sm"
              >
                View Details
              </motion.button>
            </Link>
            <Link
              href={`/booking?room=${room.id}`}
              className="flex-1"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 bg-gradient-to-r from-tyco-red to-tyco-accent text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm flex items-center justify-center gap-2"
              >
                Book Now
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}