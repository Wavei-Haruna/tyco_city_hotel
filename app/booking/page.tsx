"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BookingForm from "@/components/BookingForm";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

// Separate component for the search params logic
function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomId = searchParams.get("room");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests");

  const handleSuccess = (bookingId: string) => {
    router.push(`/booking/confirmation/${bookingId}`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-tyco-navy mb-4">
            Complete Your Reservation
          </h1>
          <p className="text-gray-600 text-lg">
            Just a few details and you're all set!
          </p>
        </motion.div>

        <BookingForm
          roomId={roomId || undefined}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          prefilledData={{
            checkIn: checkIn || undefined,
            checkOut: checkOut || undefined,
            guests: guests ? parseInt(guests) : undefined,
          }}
        />
      </div>
    </div>
  );
}

// Loading fallback component
function BookingLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-tyco-red mx-auto mb-4" />
        <p className="text-gray-600">Loading booking form...</p>
      </div>
    </div>
  );
}

// Main page component with Suspense wrapper
export default function BookingPage() {
  return (
    <Suspense fallback={<BookingLoading />}>
      <BookingContent />
    </Suspense>
  );
}