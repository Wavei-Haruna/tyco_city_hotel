"use client"

import { useState, useEffect } from "react"
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import {
  ArrowLeft,
  Calendar,
  Users,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Share2,
  Heart,
  Maximize,
  User,
  Mail,
  Phone,
  Plus,
  Minus
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

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

interface RoomDetailPageProps {
  params: {
    id: string
  }
}

// Booking Form Schema
const bookingSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  specialRequests: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

export default function RoomDetailPage({ params }: RoomDetailPageProps) {
  const router = useRouter()
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Image gallery state
  const [selectedImage, setSelectedImage] = useState(0)
  const [showGallery, setShowGallery] = useState(false)

  // Booking state
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(2)

  // Wishlist state
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Form handling
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      checkIn: "",
      checkOut: "",
    },
  })

  const watchCheckIn = watch("checkIn")
  const watchCheckOut = watch("checkOut")

  useEffect(() => {
    if (params?.id) {
      fetchRoomDetails()
    }
  }, [params?.id])

  const fetchRoomDetails = async () => {
    if (!params?.id) return

    setLoading(true)
    setError(null)

    try {
      const roomRef = doc(db, "rooms", params.id)
      const roomSnap = await getDoc(roomRef)

      if (roomSnap.exists()) {
        setRoom({
          id: roomSnap.id,
          ...roomSnap.data()
        } as Room)
      } else {
        setError("Room not found")
      }
    } catch (err) {
      console.error("Error fetching room:", err)
      setError("Failed to load room details")
    } finally {
      setLoading(false)
    }
  }

  const handleBookingClick = () => {
    if (!watchCheckIn || !watchCheckOut) {
      toast.error("Please select check-in and check-out dates")
      return
    }
    setShowBookingForm(true)
  }

  const calculateNights = () => {
    if (!watchCheckIn || !watchCheckOut) return 0
    const start = new Date(watchCheckIn)
    const end = new Date(watchCheckOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const nights = calculateNights()
  const totalPrice = room ? room.price * nights : 0

  // Submit booking
  const onSubmitBooking = async (data: BookingFormData) => {
    if (!room) return

    setIsSubmitting(true)

    try {
      const bookingData = {
        guestInfo: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
        },
        roomId: params.id,
        roomName: room.name,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        numberOfGuests: guests,
        numberOfNights: nights,
        pricePerNight: room.price,
        totalPrice: totalPrice,
        specialRequests: data.specialRequests || "",
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }

      const docRef = await addDoc(collection(db, "reservations"), bookingData)

      toast.success("Booking confirmed! Check your email for details.")
      setShowBookingForm(false)
      reset()

      // Redirect to confirmation page
      router.push(`/booking/confirmation?id=${docRef.id}`)
    } catch (error) {
      console.error("Error creating booking:", error)
      toast.error("Failed to create booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 animate-spin text-tyco-red mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">Loading room details...</p>
        </motion.div>
      </div>
    )
  }

  // Error state
  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto p-6"
        >
          <AlertCircle className="w-12 h-12 text-tyco-red mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-tyco-navy mb-2">Room Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/rooms" className="btn-primary inline-block">
            Back to Rooms
          </Link>
        </motion.div>
      </div>
    )
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "available":
        return { bg: "bg-green-500", text: "Available" }
      case "occupied":
        return { bg: "bg-red-500", text: "Occupied" }
      case "maintenance":
        return { bg: "bg-yellow-500", text: "Maintenance" }
      default:
        return { bg: "bg-gray-500", text: "Unknown" }
    }
  }

  const statusConfig = getStatusConfig(room.status)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header Navigation */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/rooms">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-tyco-navy font-semibold hover:text-tyco-red transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Rooms
              </motion.button>
            </Link>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-tyco-red text-tyco-red" : "text-gray-600"}`} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden group cursor-pointer">
                <Image
                  src={room.images[selectedImage] || "/placeholder.svg"}
                  alt={room.name}
                  fill
                  className="object-cover"
                  onClick={() => setShowGallery(true)}
                />

                <div className="absolute bottom-4 right-4 backdrop-blur-xl bg-black/60 px-4 py-2 rounded-full">
                  <span className="text-white text-sm font-semibold">
                    {selectedImage + 1} / {room.images.length}
                  </span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowGallery(true)}
                  className="absolute bottom-4 left-4 backdrop-blur-xl bg-white/90 px-4 py-2 rounded-full font-semibold text-tyco-navy hover:bg-white transition-colors flex items-center gap-2"
                >
                  <Maximize className="w-4 h-4" />
                  View All Photos
                </motion.button>

                {room.images.length > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedImage(prev => prev === 0 ? room.images.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 backdrop-blur-xl bg-white/80 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-6 h-6 text-tyco-navy" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedImage(prev => prev === room.images.length - 1 ? 0 : prev + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 backdrop-blur-xl bg-white/80 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-6 h-6 text-tyco-navy" />
                    </motion.button>
                  </>
                )}
              </div>

              {room.images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {room.images.slice(0, 4).map((img, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative h-24 rounded-xl overflow-hidden cursor-pointer ${
                        selectedImage === idx ? "ring-4 ring-tyco-red" : "ring-2 ring-gray-200"
                      }`}
                    >
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Room Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl p-8 shadow-xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-tyco-navy mb-2">{room.name}</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 fill-yellow-500" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-bold text-gray-800">{room.rating}</span>
                      <span className="text-gray-600">({room.totalReviews} reviews)</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${statusConfig.bg} animate-pulse`} />
                      <span className="text-gray-700 font-medium">{statusConfig.text}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-3xl font-bold text-tyco-red">GH₵{room.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">per night</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-tyco-navy mb-4">About This Room</h3>
                <p className="text-gray-700 leading-relaxed">{room.description}</p>
              </div>
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl p-8 shadow-xl"
            >
              <h3 className="text-2xl font-bold text-tyco-navy mb-6">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.amenities.map((amenity, idx) => (
                  <motion.div
                    key={amenity}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-200"
                  >
                    <Check className="w-5 h-5 text-tyco-red flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{amenity}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Quick Booking Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 backdrop-blur-xl bg-white/80 border border-white/20 rounded-3xl p-6 shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-tyco-navy mb-6">Reserve Your Stay</h3>

              <form onSubmit={(e) => { e.preventDefault(); handleBookingClick(); }}>
                {/* Check-in Date */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-tyco-navy mb-2">
                    Check-in
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register("checkIn")}
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tyco-red focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Check-out Date */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-tyco-navy mb-2">
                    Check-out
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      {...register("checkOut")}
                      type="date"
                      min={watchCheckIn || new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-tyco-red focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-tyco-navy mb-2">
                    Guests
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-5 h-5 text-tyco-navy" />
                    </button>
                    <div className="flex-1 text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
                        <Users className="w-5 h-5 text-gray-600" />
                        <span className="text-lg font-bold text-tyco-navy">{guests}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGuests(guests + 1)}
                      className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-5 h-5 text-tyco-navy" />
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                {nights > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-gray-50 rounded-xl space-y-2"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        GH₵{room.price.toLocaleString()} × {nights} nights
                      </span>
                      <span className="font-semibold text-gray-800">
                        GH₵{totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between">
                      <span className="font-bold text-tyco-navy">Total</span>
                      <span className="font-bold text-tyco-red text-lg">
                        GH₵{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Book Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={room.status !== "available"}
                  className="w-full py-4 bg-gradient-to-r from-tyco-red to-tyco-accent text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {room.status === "available" ? "Continue to Book" : "Not Available"}
                </motion.button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  You won't be charged yet
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Full Screen Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl"
          >
            <div className="relative h-full flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowGallery(false)}
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
              >
                <X className="w-6 h-6 text-white" />
              </motion.button>

              <div className="relative w-full h-full max-w-6xl mx-auto p-20">
                <Image
                  src={room.images[selectedImage] || "/placeholder.svg"}
                  alt={room.name}
                  fill
                  className="object-contain"
                />
              </div>

              {room.images.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedImage(prev => prev === 0 ? room.images.length - 1 : prev - 1)}
                    className="absolute left-6 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-8 h-8 text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedImage(prev => prev === room.images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-6 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-8 h-8 text-white" />
                  </motion.button>
                </>
              )}

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full">
                <span className="text-white font-semibold">
                  {selectedImage + 1} / {room.images.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Form Modal */}
      <AnimatePresence>
        {showBookingForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowBookingForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-tyco-navy">Complete Your Booking</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowBookingForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit(onSubmitBooking)} className="space-y-6">
                {/* Guest Information */}
                <div>
                  <h3 className="text-lg font-bold text-tyco-navy mb-4">Guest Information</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-tyco-navy mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          {...register("fullName")}
                          type="text"
                          placeholder="John Doe"
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-tyco-red focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-tyco-red text-xs mt-1">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-tyco-navy mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="john.doe@example.com"
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-tyco-red focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-tyco-red text-xs mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-tyco-navy mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          {...register("phone")}
                          type="tel"
                          placeholder="+233 20 000 0000"
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-tyco-red focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-tyco-red text-xs mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Booking Summary */}
                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                  <h3 className="text-lg font-bold text-tyco-navy mb-4">Booking Summary</h3>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Room</span>
                      <span className="font-semibold text-tyco-navy">{room.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Check-in</span>
                      <span className="font-semibold text-tyco-navy">
                        {watchCheckIn ? new Date(watchCheckIn).toLocaleDateString() : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Check-out</span>
                      <span className="font-semibold text-tyco-navy">
                        {watchCheckOut ? new Date(watchCheckOut).toLocaleDateString() : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Guests</span>
                      <span className="font-semibold text-tyco-navy">{guests}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Nights</span>
                      <span className="font-semibold text-tyco-navy">{nights}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
                      <span className="font-bold text-tyco-navy text-lg">Total</span>
                      <span className="font-bold text-tyco-red text-2xl">
                        GH₵{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-semibold text-tyco-navy mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    {...register("specialRequests")}
                    rows={3}
                    placeholder="Any special requirements..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-tyco-red focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-gradient-to-r from-tyco-red to-tyco-accent text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Confirm Booking
                      </>
                    )}
                  </motion.button>
                </div>

                <p className="text-xs text-center text-gray-500">
                  By confirming, you agree to our terms and conditions
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}