// app/admin/reservations/create/page.tsx - Admin create reservation
"use client";

import {  useRouter } from "next/navigation";
import BookingForm from "@/components/BookingForm";
import AdminDashboardLayout from "../../page";


export default function AdminCreateReservation() {
  const router = useRouter();




  return (
    <AdminDashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-tyco-navy mb-2">
          Create New Reservation
        </h1>
        <p className="text-gray-600">
          Add a reservation for a guest
        </p>
      </div>

      <BookingForm
         onSuccess={(bookingId) => router.push(`/admin/reservations/${bookingId}`)}
       />
    </AdminDashboardLayout>
  );
}