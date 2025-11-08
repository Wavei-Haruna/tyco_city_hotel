"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc, query, where, getDocs } from "firebase/firestore";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  Mail,
  Phone,
  Loader2,
  Check,
  Bed,
  Users,
  X,
  Plus,
  Minus,
} from "lucide-react";

// Simplified Validation Schema
const bookingSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  specialRequests: z.string().optional(),
  roomId: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  roomId?: string;
  onSuccess?: (bookingId: string) => void;
  onCancel?: () => void;
  prefilledData?: {
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  };
}

export default function BookingForm({
  roomId,
  onSuccess,
  onCancel,
  prefilledData,
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [room, setRoom] = useState<any>(null);
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState(roomId || "");
  const [loadingRoom, setLoadingRoom] = useState(false);
  const [guests, setGuests] = useState(prefilledData?.guests || 1);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      checkIn: prefilledData?.checkIn || "",
      checkOut: prefilledData?.checkOut || "",
      roomId: roomId || "",
    },
  });

  const watchCheckIn = watch("checkIn");
  const watchCheckOut = watch("checkOut");

  // Fetch room details if roomId is provided
  useEffect(() => {
    if (roomId) {
      fetchRoomDetails(roomId);
    } else {
      fetchAllRooms();
    }
  }, [roomId]);

  useEffect(() => {
  if (roomId) {
    setSelectedRoomId(roomId);
    fetchRoomDetails(roomId);
  }
}, [roomId]);

  // Fetch single room
  const fetchRoomDetails = async (id: string) => {
    setLoadingRoom(true);
    try {
      const roomDoc = await getDoc(doc(db, "rooms", id));
      if (roomDoc.exists()) {
        setRoom({ id: roomDoc.id, ...roomDoc.data() });
      }
    } catch (error) {
      console.error("Error fetching room:", error);
      toast.error("Failed to load room details");
    } finally {
      setLoadingRoom(false);
    }
  };

  // Fetch all available rooms
  const fetchAllRooms = async () => {
    setLoadingRoom(true);
    try {
      const roomsQuery = query(
        collection(db, "rooms"),
        where("status", "==", "available")
      );
      const querySnapshot = await getDocs(roomsQuery);
      const roomsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomsData);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to load rooms");
    } finally {
      setLoadingRoom(false);
    }
  };

  // Handle room selection
  const handleRoomSelect = (id: string) => {
    setSelectedRoomId(id);
    const selectedRoom = rooms.find((r) => r.id === id);
    if (selectedRoom) {
      setRoom(selectedRoom);
    }
  };

  // Calculate number of nights
  const calculateNights = () => {
    if (!watchCheckIn || !watchCheckOut) return 0;
    const start = new Date(watchCheckIn);
    const end = new Date(watchCheckOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const nights = calculateNights();
  const totalPrice = room ? room.price * nights : 0;

  // Submit form
  const onSubmit = async (data: BookingFormData) => {
    if (!selectedRoomId && !roomId) {
      toast.error("Please select a room");
      return;
    }

    if (guests < 1) {
      toast.error("At least 1 guest is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        guestInfo: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
        },
        roomId: roomId || selectedRoomId,
        roomName: room?.name || "N/A",
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        numberOfGuests: guests,
        numberOfNights: nights,
        pricePerNight: room?.price || 0,
        totalPrice: totalPrice,
        specialRequests: data.specialRequests || "",
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "reservations"), bookingData);

      // TODO: Send confirmation email here
      toast.success("Booking confirmed! Check your email for details.");

      if (onSuccess) {
        onSuccess(docRef.id);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-card border border-gray-100"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Room Selection - Only show if no roomId provided */}
              {!roomId && (
                <div>
                  <label className="block text-sm font-semibold text-tyco-navy mb-3">
                    Select Room Type *
                  </label>
                  {loadingRoom ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-tyco-red mx-auto" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {rooms.map((roomOption) => (
                        <button
                          key={roomOption.id}
                          type="button"
                          onClick={() => handleRoomSelect(roomOption.id)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            selectedRoomId === roomOption.id
                              ? "border-tyco-red bg-tyco-red/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              selectedRoomId === roomOption.id
                                ? "bg-tyco-red text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                              <Bed className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-tyco-navy mb-1">
                                {roomOption.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                GH₵ {roomOption.price?.toLocaleString()}/night
                              </p>
                            </div>
                            {selectedRoomId === roomOption.id && (
                              <Check className="w-5 h-5 text-tyco-red" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

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

              {/* Stay Details */}
              <div>
                <h3 className="text-lg font-bold text-tyco-navy mb-4">Stay Details</h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-tyco-navy mb-2">
                        Check-in *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          {...register("checkIn")}
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-tyco-red focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      {errors.checkIn && (
                        <p className="text-tyco-red text-xs mt-1">{errors.checkIn.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-tyco-navy mb-2">
                        Check-out *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          {...register("checkOut")}
                          type="date"
                          min={watchCheckIn || new Date().toISOString().split("T")[0]}
                          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-tyco-red focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      {errors.checkOut && (
                        <p className="text-tyco-red text-xs mt-1">{errors.checkOut.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Number of Guests */}
                  <div>
                    <label className="block text-sm font-semibold text-tyco-navy mb-2">
                      Number of Guests
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
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-xl">
                          <Users className="w-5 h-5 text-gray-600" />
                          <span className="text-lg font-bold text-tyco-navy">{guests}</span>
                          <span className="text-sm text-gray-600">
                            {guests === 1 ? "Guest" : "Guests"}
                          </span>
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
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || (!roomId && !selectedRoomId)}
                className="w-full py-4 bg-gradient-to-r from-tyco-red to-tyco-accent text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Confirm Reservation
                  </>
                )}
              </button>

              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full py-3 text-gray-600 hover:text-tyco-navy font-semibold transition-colors"
                >
                  Cancel
                </button>
              )}
            </form>
          </motion.div>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-24 bg-white rounded-2xl p-6 shadow-card border border-gray-100"
          >
            <h3 className="text-xl font-bold text-tyco-navy mb-4">Booking Summary</h3>

            {loadingRoom ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-tyco-red mx-auto" />
              </div>
            ) : room ? (
              <>
                <div className="mb-4">
                  <img
                    src={room.images?.[0] || "/placeholder.svg"}
                    alt={room.name}
                    className="w-full h-40 object-cover rounded-xl mb-3"
                  />
                  <h4 className="font-bold text-tyco-navy text-lg mb-1">{room.name}</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-tyco-red">
                      GH₵ {room.price?.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">per night</span>
                  </div>
                </div>

                {nights > 0 && (
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {nights} {nights === 1 ? "night" : "nights"}
                      </span>
                      <span className="font-semibold">GH₵ {(room.price * nights).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {guests} {guests === 1 ? "guest" : "guests"}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                      <span className="font-bold text-tyco-navy">Total</span>
                      <span className="font-bold text-tyco-red text-2xl">
                        GH₵ {totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 bg-gray-50 rounded-xl text-center text-sm text-gray-600">
                {roomId ? "Loading room..." : "Select a room to see details"}
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> You won't be charged yet. Confirmation email will be sent after booking.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}