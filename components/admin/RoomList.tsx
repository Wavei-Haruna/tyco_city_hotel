// components/admin/RoomsList.tsx
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { toast } from "sonner";
import {
  Bed,
  Star,
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AdminDashboardLayout from "@/app/admin/page";

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
}

export default function RoomsList() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Fetch rooms from Firestore
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const roomsQuery = query(
        collection(db, "rooms"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(roomsQuery);
      const roomsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Room[];

      setRooms(roomsData);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  // Delete room
  const handleDelete = async (roomId: string, roomName: string) => {
    if (!confirm(`Are you sure you want to delete "${roomName}"?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, "rooms", roomId));
      setRooms(rooms.filter((room) => room.id !== roomId));
      toast.success("Room deleted successfully");
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error("Failed to delete room");
    }
  };

  // Filter rooms
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || room.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700";
      case "occupied":
        return "bg-red-100 text-red-700";
      case "maintenance":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-tyco-red animate-spin" />
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-tyco-navy mb-2">
            Room Management
          </h1>
          <p className="text-gray-600">
            Manage your hotel rooms and availability
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/rooms/create")}
          className="btn-accent flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Room
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-tyco-border
                       focus:ring-2 focus:ring-tyco-red focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-card border border-gray-100 text-center">
          <Bed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">No Rooms Found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your filters"
              : "Get started by creating your first room listing"}
          </p>
          <button
            onClick={() => router.push("/admin/rooms/create")}
            className="btn-accent inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Room Listing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden
                       hover:shadow-xl transition-all group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={room.images[0] || "/placeholder-room.jpg"}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      room.status
                    )}`}
                  >
                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                  </span>
                </div>
                <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 shadow-lg">
                  <span className="text-tyco-navy font-bold text-sm">
                    GH₵{room.price}/night
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-tyco-navy mb-2">
                  {room.name}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold text-gray-700">
                      {room.rating}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({room.totalReviews} reviews)
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {room.description}
                </p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {room.amenities.slice(0, 3).map((amenity, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg"
                    >
                      {amenity}
                    </span>
                  ))}
                  {room.amenities.length > 3 && (
                    <span className="text-xs bg-tyco-red/10 text-tyco-red px-2 py-1 rounded-lg">
                      +{room.amenities.length - 3} more
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/admin/rooms/${room.id}`)}
                    className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl
                             hover:bg-gray-200 transition-all text-sm font-semibold
                             flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => router.push(`/admin/rooms/edit/${room.id}`)}
                    className="flex-1 py-2 bg-tyco-red text-white rounded-xl
                             hover:bg-tyco-accent transition-all text-sm font-semibold
                             flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(room.id, room.name)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-xl
                             hover:bg-red-200 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Footer */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-card border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Rooms</p>
          <p className="text-2xl font-bold text-tyco-navy">{rooms.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Available</p>
          <p className="text-2xl font-bold text-green-600">
            {rooms.filter((r) => r.status === "available").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Occupied</p>
          <p className="text-2xl font-bold text-red-600">
            {rooms.filter((r) => r.status === "occupied").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-card border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Maintenance</p>
          <p className="text-2xl font-bold text-yellow-600">
            {rooms.filter((r) => r.status === "maintenance").length}
          </p>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}