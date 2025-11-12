"use client"

export default function RoomCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-200 animate-pulse">
      {/* Image */}
      <div className="w-full h-56 bg-gray-200" />

      <div className="p-4 space-y-4">
        {/* Title */}
        <div className="h-6 w-3/5 bg-gray-200 rounded-lg" />

        {/* Price */}
        <div className="h-5 w-1/3 bg-gray-200 rounded-md" />

        {/* Amenities */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded-md" />
          <div className="h-4 w-4/5 bg-gray-200 rounded-md" />
          <div className="h-4 w-3/4 bg-gray-200 rounded-md" />
        </div>

        {/* CTA */}
        <div className="h-10 w-full bg-gray-200 rounded-lg" />
      </div>
    </div>
  )
}
