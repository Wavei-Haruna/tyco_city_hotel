"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Room type definition
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
  createdAt?: any
  updatedAt?: any
}

interface RoomCardProps {
  room: Room
  index?: number
}

// Room Card Component with Mouse-Following Border Light
export function RoomCard({ room, index = 0 }: RoomCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mouseAngle, setMouseAngle] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const mouseX = e.clientX
    const mouseY = e.clientY

    // Calculate angle from center to mouse
    const angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI)
    setMouseAngle(angle + 90) // +90 to align with CSS rotation
  }

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
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="group relative"
    >
      {/* Outer container for border effect */}
      <div className="relative rounded-3xl overflow-hidden">
        {/* Animated traveling light on border - follows mouse */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: `conic-gradient(from ${mouseAngle}deg, transparent, transparent 5%, #DC2626 15%, #EAB308 20%, #1E3A8A 25%, transparent 35%, transparent)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />

        {/* Inner container - creates the border effect */}
        <div className="absolute inset-[2px] bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 rounded-3xl" />

        {/* Main Card Container */}
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative backdrop-blur-2xl bg-white/70 border border-white/20 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500 m-[2px]"
        >
          {/* Image Container */}
          <div className="relative h-56 overflow-hidden rounded-t-3xl">
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
              className={`absolute top-4 left-4 backdrop-blur-xl ${statusConfig.bg} border ${statusConfig.border} px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2`}
            >
              <span className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`} />
              <span className={`text-xs font-semibold ${statusConfig.text}`}>
                {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
              </span>
            </motion.div>
          </div>

          {/* Content Container */}
          <div className="p-6 bg-white/70">
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
      </div>
    </motion.div>
  )
}