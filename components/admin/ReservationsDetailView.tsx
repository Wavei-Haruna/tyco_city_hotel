"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { toast } from "sonner";
import AdminDashboardLayout from "@/app/admin/page";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Phone,
  Bed,
  Users,
  DollarSign,
  Clock,
  Edit2,
  Save,
  X,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  MessageSquare,
  FileText,
} from "lucide-react";

interface ReservationDetailsProps {
  reservationId: string;
}

interface Reservation {
  id: string;
  guestInfo: {
    fullName: string;
    email: string;
    phone: string;
  };
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  numberOfGuests: number;
  numberOfNights: number;
  pricePerNight: number;
  totalPrice: number;
  specialRequests?: string;
  status: "pending" | "confirmed" | "checked-in" | "checked-out" | "cancelled";
  createdAt: any;
  updatedAt: any;
}

export default function ReservationDetailsView({
  reservationId,
}: ReservationDetailsProps) {
  const router = useRouter();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Edit form state
  const [editData, setEditData] = useState({
    checkIn: "",
    checkOut: "",
    numberOfGuests: 1,
    specialRequests: "",
  });

  useEffect(() => {
    if (reservationId) {
      fetchReservationDetails();
    }
  }, [reservationId]);

  const fetchReservationDetails = async () => {
    if (!reservationId) return;

    setLoading(true);
    try {
      const reservationDoc = await getDoc(doc(db, "reservations", reservationId));

      if (reservationDoc.exists()) {
        const data = {
          id: reservationDoc.id,
          ...reservationDoc.data(),
        } as Reservation;

        setReservation(data);
        setEditData({
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          numberOfGuests: data.numberOfGuests,
          specialRequests: data.specialRequests || "",
        });
      } else {
        toast.error("Reservation not found");
        router.push("/admin/reservations");
      }
    } catch (error) {
      console.error("Error fetching reservation:", error);
      toast.error("Failed to load reservation details");
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleSave = async () => {
    if (!reservation) return;

    const nights = calculateNights(editData.checkIn, editData.checkOut);
    if (nights <= 0) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    setSaving(true);
    try {
      const newTotalPrice = reservation.pricePerNight * nights;

      await updateDoc(doc(db, "reservations", reservationId), {
        checkIn: editData.checkIn,
        checkOut: editData.checkOut,
        numberOfGuests: editData.numberOfGuests,
        numberOfNights: nights,
        totalPrice: newTotalPrice,
        specialRequests: editData.specialRequests,
        updatedAt: new Date(),
      });

      setReservation({
        ...reservation,
        checkIn: editData.checkIn,
        checkOut: editData.checkOut,
        numberOfGuests: editData.numberOfGuests,
        numberOfNights: nights,
        totalPrice: newTotalPrice,
        specialRequests: editData.specialRequests,
      });

      toast.success("Reservation updated successfully");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating reservation:", error);
      toast.error("Failed to update reservation");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: Reservation["status"]) => {
    if (!reservation) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, "reservations", reservationId), {
        status: newStatus,
        updatedAt: new Date(),
      });

      setReservation({ ...reservation, status: newStatus });
      toast.success(`Reservation ${newStatus} successfully`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this reservation? This action cannot be undone.")) {
      return;
    }

    setDeleting(true);
    try {
      await deleteDoc(doc(db, "reservations", reservationId));
      toast.success("Reservation deleted successfully");
      router.push("/admin/reservations");
    } catch (error) {
      console.error("Error deleting reservation:", error);
      toast.error("Failed to delete reservation");
      setDeleting(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" };
      case "confirmed":
        return { bg: "bg-blue-100", text: "text-blue-700", label: "Confirmed" };
      case "checked-in":
        return { bg: "bg-green-100", text: "text-green-700", label: "Checked In" };
      case "checked-out":
        return { bg: "bg-gray-100", text: "text-gray-700", label: "Checked Out" };
      case "cancelled":
        return { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", label: "Unknown" };
    }
  };

  if (loading || !reservationId) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-tyco-red animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading reservation details...</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (!reservation) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">Reservation Not Found</h3>
            <button
              onClick={() => router.push("/admin/reservations")}
              className="btn-primary mt-4"
            >
              Back to Reservations
            </button>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  const statusConfig = getStatusConfig(reservation.status);

  return (
    <AdminDashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
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
                Reservation Details
              </h1>
              <p className="text-gray-600">ID: {reservation.id}</p>
            </div>

            <div className="flex gap-3">
              {!editMode ? (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-tyco-navy text-white rounded-xl
                             font-semibold hover:bg-tyco-secondary transition-all shadow-md"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-100 text-red-700 rounded-xl
                             font-semibold hover:bg-red-200 transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deleting ? (
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
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setEditData({
                        checkIn: reservation.checkIn,
                        checkOut: reservation.checkOut,
                        numberOfGuests: reservation.numberOfGuests,
                        specialRequests: reservation.specialRequests || "",
                      });
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl
                             font-semibold hover:bg-gray-50 transition-all"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-tyco-red to-tyco-accent
                             text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Guest Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-card border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-tyco-red to-tyco-accent flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-tyco-navy">Guest Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Full Name</span>
                  </div>
                  <p className="font-bold text-tyco-navy">{reservation.guestInfo.fullName}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="font-bold text-tyco-navy">{reservation.guestInfo.email}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl md:col-span-2">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">Phone Number</span>
                  </div>
                  <p className="font-bold text-tyco-navy">{reservation.guestInfo.phone}</p>
                </div>
              </div>
            </motion.div>

            {/* Stay Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-card border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-tyco-navy">Stay Details</h2>
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-tyco-navy mb-2">
                        Check-in Date
                      </label>
                      <input
                        type="date"
                        value={editData.checkIn}
                        onChange={(e) => setEditData({ ...editData, checkIn: e.target.value })}
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-tyco-navy mb-2">
                        Check-out Date
                      </label>
                      <input
                        type="date"
                        value={editData.checkOut}
                        onChange={(e) => setEditData({ ...editData, checkOut: e.target.value })}
                        min={editData.checkIn}
                        className="input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-tyco-navy mb-2">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editData.numberOfGuests}
                      onChange={(e) =>
                        setEditData({ ...editData, numberOfGuests: parseInt(e.target.value) })
                      }
                      className="input"
                    />
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-800">
                      <strong>Calculated Nights:</strong>{" "}
                      {calculateNights(editData.checkIn, editData.checkOut)}
                    </p>
                    <p className="text-sm text-blue-800">
                      <strong>New Total:</strong> GH₵{" "}
                      {(
                        reservation.pricePerNight *
                        calculateNights(editData.checkIn, editData.checkOut)
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">Check-in</span>
                    </div>
                    <p className="font-bold text-tyco-navy">{reservation.checkIn}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">Check-out</span>
                    </div>
                    <p className="font-bold text-tyco-navy">{reservation.checkOut}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">Number of Guests</span>
                    </div>
                    <p className="font-bold text-tyco-navy">{reservation.numberOfGuests}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Number of Nights</span>
                    </div>
                    <p className="font-bold text-tyco-navy">{reservation.numberOfNights}</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Special Requests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-card border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-tyco-navy">Special Requests</h2>
              </div>

              {editMode ? (
                <textarea
                  value={editData.specialRequests}
                  onChange={(e) =>
                    setEditData({ ...editData, specialRequests: e.target.value })
                  }
                  rows={4}
                  placeholder="Any special requests or notes..."
                  className="input resize-none"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {reservation.specialRequests || "No special requests"}
                </p>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-card border border-gray-100"
            >
              <h3 className="text-lg font-bold text-tyco-navy mb-4">Status</h3>
              <span
                className={`inline-block px-4 py-2 rounded-xl text-sm font-semibold ${statusConfig.bg} ${statusConfig.text}`}
              >
                {statusConfig.label}
              </span>

              <div className="mt-6 space-y-2">
                {reservation.status === "pending" && (
                  <button
                    onClick={() => handleStatusChange("confirmed")}
                    disabled={saving}
                    className="w-full py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirm
                  </button>
                )}

                {reservation.status === "confirmed" && (
                  <button
                    onClick={() => handleStatusChange("checked-in")}
                    disabled={saving}
                    className="w-full py-2 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Check In
                  </button>
                )}

                {reservation.status === "checked-in" && (
                  <button
                    onClick={() => handleStatusChange("checked-out")}
                    disabled={saving}
                    className="w-full py-2 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Check Out
                  </button>
                )}

                {reservation.status !== "cancelled" && reservation.status !== "checked-out" && (
                  <button
                    onClick={() => handleStatusChange("cancelled")}
                    disabled={saving}
                    className="w-full py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Reservation
                  </button>
                )}
              </div>
            </motion.div>

            {/* Room & Price Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-card border border-gray-100"
            >
              <h3 className="text-lg font-bold text-tyco-navy mb-4">Room & Pricing</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Bed className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-600">Room</p>
                    <p className="font-bold text-tyco-navy">{reservation.roomName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-600">Price per Night</p>
                    <p className="font-bold text-tyco-navy">
                      GH₵ {reservation.pricePerNight.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-tyco-red to-tyco-accent rounded-xl text-white">
                  <p className="text-sm opacity-90 mb-1">Total Price</p>
                  <p className="text-3xl font-bold">
                    GH₵ {reservation.totalPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Timestamps */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-card border border-gray-100"
            >
              <h3 className="text-lg font-bold text-tyco-navy mb-4">Booking Info</h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <FileText className="w-4 h-4" />
                  <span>ID: {reservation.id}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    Created:{" "}
                    {reservation.createdAt?.toDate?.()?.toLocaleDateString() || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    Updated:{" "}
                    {reservation.updatedAt?.toDate?.()?.toLocaleDateString() || "N/A"}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}