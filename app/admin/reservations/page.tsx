"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "sonner";
import AdminDashboardLayout from "@/app/admin/page";
import {
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Bed,
  Mail,
  Phone,
  Loader2,
  Download,
  RefreshCw,
  DollarSign,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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

export default function AdminReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    filterReservations();
  }, [searchTerm, statusFilter, reservations]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const reservationsQuery = query(
        collection(db, "reservations"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(reservationsQuery);
      const reservationsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Reservation[];

      setReservations(reservationsData);
      setFilteredReservations(reservationsData);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast.error("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  const filterReservations = () => {
    let filtered = [...reservations];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (res) =>
          res.guestInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          res.guestInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          res.roomName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((res) => res.status === statusFilter);
    }

    setFilteredReservations(filtered);
  };

  const updateReservationStatus = async (
    reservationId: string,
    newStatus: Reservation["status"]
  ) => {
    setActionLoading(true);
    try {
      await updateDoc(doc(db, "reservations", reservationId), {
        status: newStatus,
        updatedAt: new Date(),
      });

      setReservations((prev) =>
        prev.map((res) =>
          res.id === reservationId ? { ...res, status: newStatus } : res
        )
      );

      toast.success(`Reservation ${newStatus} successfully`);
      setSelectedReservation(null);
    } catch (error) {
      console.error("Error updating reservation:", error);
      toast.error("Failed to update reservation");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteReservation = async (reservationId: string) => {
    if (!confirm("Are you sure you want to delete this reservation?")) {
      return;
    }

    setActionLoading(true);
    try {
      await deleteDoc(doc(db, "reservations", reservationId));
      setReservations((prev) => prev.filter((res) => res.id !== reservationId));
      toast.success("Reservation deleted successfully");
      setSelectedReservation(null);
    } catch (error) {
      console.error("Error deleting reservation:", error);
      toast.error("Failed to delete reservation");
    } finally {
      setActionLoading(false);
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

  const getStats = () => {
    return {
      total: reservations.length,
      pending: reservations.filter((r) => r.status === "pending").length,
      confirmed: reservations.filter((r) => r.status === "confirmed").length,
      checkedIn: reservations.filter((r) => r.status === "checked-in").length,
      revenue: reservations
        .filter((r) => r.status !== "cancelled")
        .reduce((sum, r) => sum + r.totalPrice, 0),
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-tyco-red animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading reservations...</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-tyco-navy mb-2">Reservations</h1>
            <p className="text-gray-600">Manage all hotel reservations</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchReservations}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl
                       hover:bg-gray-200 transition-all font-semibold"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Reservations</p>
          <p className="text-xl font-bold text-tyco-navy">{stats.total}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Confirmed</p>
          <p className="text-xl font-bold text-blue-600">{stats.confirmed}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Checked In</p>
          <p className="text-xl font-bold text-green-600">{stats.checkedIn}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 text-tyco-red" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-xl font-bold text-tyco-red">
            GH₵ {stats.revenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by guest name, email, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-tyco-red focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked-in">Checked In</option>
            <option value="checked-out">Checked Out</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Reservations Table */}
      {filteredReservations.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-card border border-gray-100 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">No Reservations Found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "No reservations have been made yet"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Guest
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Room
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Check-in
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Check-out
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Guests
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReservations.map((reservation) => {
                  const statusConfig = getStatusConfig(reservation.status);
                  return (
                    <motion.tr
                      key={reservation.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-tyco-navy">
                            {reservation.guestInfo.fullName}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                            <Mail className="w-3 h-3" />
                            {reservation.guestInfo.email}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                            <Phone className="w-3 h-3" />
                            {reservation.guestInfo.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Bed className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-700">
                            {reservation.roomName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {reservation.checkIn}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {reservation.checkOut}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          <Users className="w-4 h-4" />
                          {reservation.numberOfGuests}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-tyco-red">
                          GH₵ {reservation.totalPrice.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {reservation.numberOfNights} nights
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}
                        >
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setSelectedReservation(
                                selectedReservation === reservation.id
                                  ? null
                                  : reservation.id
                              )
                            }
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </button>

                          {/* Dropdown Menu */}
                          <AnimatePresence>
                            {selectedReservation === reservation.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setSelectedReservation(null)}
                                />
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20"
                                >
                                  <button
                                    onClick={() =>
                                      router.push(`/admin/reservations/${reservation.id}`)
                                    }
                                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-sm"
                                  >
                                    <Eye className="w-4 h-4 text-gray-600" />
                                    View Details
                                  </button>

                                  {reservation.status === "pending" && (
                                    <button
                                      onClick={() =>
                                        updateReservationStatus(reservation.id, "confirmed")
                                      }
                                      disabled={actionLoading}
                                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-sm"
                                    >
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      Confirm
                                    </button>
                                  )}

                                  {reservation.status === "confirmed" && (
                                    <button
                                      onClick={() =>
                                        updateReservationStatus(reservation.id, "checked-in")
                                      }
                                      disabled={actionLoading}
                                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-sm"
                                    >
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      Check In
                                    </button>
                                  )}

                                  {reservation.status === "checked-in" && (
                                    <button
                                      onClick={() =>
                                        updateReservationStatus(reservation.id, "checked-out")
                                      }
                                      disabled={actionLoading}
                                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-sm"
                                    >
                                      <CheckCircle className="w-4 h-4 text-gray-600" />
                                      Check Out
                                    </button>
                                  )}

                                  {reservation.status !== "cancelled" && (
                                    <button
                                      onClick={() =>
                                        updateReservationStatus(reservation.id, "cancelled")
                                      }
                                      disabled={actionLoading}
                                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-sm"
                                    >
                                      <XCircle className="w-4 h-4 text-red-600" />
                                      Cancel
                                    </button>
                                  )}

                                  <div className="border-t border-gray-100 my-2" />

                                  <button
                                    onClick={() => deleteReservation(reservation.id)}
                                    disabled={actionLoading}
                                    className="w-full px-4 py-2 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-sm text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                  </button>
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
}