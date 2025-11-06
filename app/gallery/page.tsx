"use client"

import { useState } from "react"
import { Footer } from "@/components/footer"
import { X } from "lucide-react"
import Image from "next/image"
import Navbar from "@/components/navbar"

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const galleryImages = [
    { id: 1, category: "rooms", title: "Deluxe Room", image: "/luxury-hotel-presidential-suite-with-panoramic-vie.jpg" },
    { id: 2, category: "dining", title: "Fine Dining", image: "/luxury-hotel-deluxe-room-with-city-view.jpg" },
    { id: 3, category: "spa", title: "Spa & Wellness", image: "/luxury-hotel-deluxe-room-with-city-view.jpg" },
    { id: 4, category: "lobby", title: "Grand Lobby", image: "/luxury-hotel-presidential-suite-with-panoramic-vie.jpg" },
    { id: 5, category: "rooms", title: "Suite Room", image: "/luxury-hotel-deluxe-room-with-city-view.jpg" },
    { id: 6, category: "events", title: "Grand Ballroom", image: "/luxury-hotel-presidential-suite-with-panoramic-vie.jpg" },
    { id: 7, category: "pool", title: "Swimming Pool", image: "/luxury-hotel-presidential-suite-with-panoramic-vie.jpg" },
    { id: 8, category: "dining", title: "Restaurant", image: "/luxury-hotel-deluxe-room-with-city-view.jpg" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-tyco-navy to-tyco-navy-light text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-xl text-white/80">Explore the beauty and elegance of Tyco Hotel</p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item.image)}
                className="relative h-64 overflow-hidden rounded-xl cursor-pointer group glass-card"
              >
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tyco-navy/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white font-semibold">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full h-96 sm:h-full max-h-96 sm:max-h-screen">
            <Image src={selectedImage || "/placeholder.svg"} alt="Gallery" fill className="object-contain" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
