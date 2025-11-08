"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import {
  ArrowLeft,
  Star,
  Bed,
  Edit,
  Trash2,
  Loader2,
  Check,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import AdminDashboardLayout from "@/app/admin/page";


interface RoomDetailsProps {
  roomId: string;
}

interface Room {
  id: string;
  name: string;
  price: number;
  rating: number;
  totalReviews: number;
  amenities: string[];
  status: "available" | "occupied" | "maintenance";
  images: string[];
  description: string;
  createdAt: any;
  updatedAt: any;
}

export default function ViewRoomDetails({ roomId }: RoomDetailsProps) {
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    // Only fetch if roomId is available
    if (roomId) {
      fetchRoomDetails();
    }
  }, [roomId]);

  const fetchRoomDetails = async () => {
    if (!roomId) {
      toast.error("Invalid room ID");
      setLoading(false);
      return;
    }

    try {
      const roomDoc = await getDoc(doc(db, "rooms", roomId));

      if (roomDoc.exists()) {
        setRoom({
          id: roomDoc.id,
          ...roomDoc.data(),
        } as Room);
      } else {
        toast.error("Room not found");
        router.push("/admin/rooms");
      }
    } catch (error) {
      console.error("Error fetching room:", error);
      toast.error("Failed to load room details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!room) return;

    if (!confirm(`Are you sure you want to delete "${room.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeleteLoading(true);
    try {
      const { deleteDoc, doc } = await import("firebase/firestore");
      await deleteDoc(doc(db, "rooms", roomId));
      toast.success("Room deleted successfully");
      router.push("/admin/rooms");
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error("Failed to delete room");
      setDeleteLoading(false);
    }
  };

  const nextImage = () => {
    if (room && room.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === room.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const previousImage = () => {
    if (room && room.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? room.images.length - 1 : prev - 1
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700 border-green-200";
      case "occupied":
        return "bg-red-100 text-red-700 border-red-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading || !roomId) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-tyco-red animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading room details...</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (!room) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Bed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">Room Not Found</h3>
            <button
              onClick={() => router.push("/admin/rooms")}
              className="btn-primary mt-4"
            >
              Back to Rooms
            </button>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-tyco-red transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-tyco-navy mb-2">
                {room.name}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-gray-700">
                    {room.rating}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({room.totalReviews} reviews)
                  </span>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                    room.status
                  )}`}
                >
                  {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/admin/rooms/edit/${room.id}`)}
                className="flex items-center gap-2 px-5 py-2.5 bg-tyco-red text-white rounded-xl
                         font-semibold hover:bg-tyco-accent transition-all shadow-md
                         hover:shadow-lg hover:-translate-y-0.5"
              >
                <Edit className="w-4 h-4" />
                Edit Room
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-100 text-red-700 rounded-xl
                         font-semibold hover:bg-red-200 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
              {room.images && room.images.length > 0 ? (
                <div className="relative">
                  {/* Main Image */}
                  <div className="relative h-96 bg-gray-100">
                    <img
                      src={room.images[currentImageIndex]}
                      alt={`${room.name} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Navigation Arrows */}
                    {room.images.length > 1 && (
                      <>
                        <button
                          onClick={previousImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                                   bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center
                                   hover:bg-white transition-all"
                        >
                          <ChevronLeft className="w-6 h-6 text-tyco-navy" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                                   bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center
                                   hover:bg-white transition-all"
                        >
                          <ChevronRight className="w-6 h-6 text-tyco-navy" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white
                                  px-3 py-1.5 rounded-lg text-sm font-semibold">
                      {currentImageIndex + 1} / {room.images.length}
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  {room.images.length > 1 && (
                    <div className="p-4 bg-gray-50 flex gap-3 overflow-x-auto">
                      {room.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all
                                    ${
                                      index === currentImageIndex
                                        ? "border-tyco-red shadow-md"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No images available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
              <h2 className="text-xl font-bold text-tyco-navy mb-4">
                Room Description
              </h2>
              <p className="text-gray-700 leading-relaxed">{room.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
              <h2 className="text-xl font-bold text-tyco-navy mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-tyco-red" />
                Room Amenities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {room.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-tyco-red/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-tyco-red" />
                    </div>
                    <span className="text-gray-700 font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quick Info */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-gradient-to-br from-tyco-red to-tyco-navy rounded-2xl p-6 shadow-xl text-white">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5" />
                <span className="text-sm font-medium opacity-90">Price per Night</span>
              </div>
              <p className="text-4xl font-bold mb-4">GH₵ {room.price}</p>
              <button
                onClick={() => router.push(`/admin/reservations/create?roomId=${room.id}`)}
                className="w-full py-3 bg-white text-tyco-red rounded-xl font-semibold
                         hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
              >
                Create Reservation
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 space-y-4">
              <h3 className="font-bold text-tyco-navy mb-4">Quick Information</h3>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Bed className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-gray-600 font-medium">Status</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    room.status
                  )}`}
                >
                  {room.status}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-500" />
                  </div>
                  <span className="text-gray-600 font-medium">Rating</span>
                </div>
                <span className="font-bold text-tyco-navy">
                  {room.rating} / 5.0
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-gray-600 font-medium">Reviews</span>
                </div>
                <span className="font-bold text-tyco-navy">
                  {room.totalReviews}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-600 font-medium">Amenities</span>
                </div>
                <span className="font-bold text-tyco-navy">
                  {room.amenities.length}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 space-y-3">
              <h3 className="font-bold text-tyco-navy mb-4">Quick Actions</h3>

              <button
                onClick={() => router.push(`/admin/rooms/edit/${room.id}`)}
                className="w-full py-3 bg-tyco-navy text-white rounded-xl font-semibold
                         hover:bg-tyco-secondary transition-all flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Details
              </button>

              <button
                onClick={() => router.push("/admin/reservations")}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold
                         hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                View Reservations
              </button>

              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-semibold
                         hover:bg-red-100 transition-all flex items-center justify-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Room
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}