"use client"

import { useState, useMemo } from "react"
import Navbar  from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Star, Filter, ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { RoomsDisplay } from "@/components/RoomsDisplay"

export default function RoomsPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [sortBy, setSortBy] = useState("featured")

  const allRooms = [
    {
      id: 1,
      name: "Deluxe Room",
      type: "deluxe",
      price: 299,
      image: "/luxury-hotel-executive-suite-with-living-area.jpg",
      features: ["King Bed", "City View", "Marble Bathroom", "Free WiFi", "Air Conditioning"],
      rating: 4.8,
      reviews: 245,
      availability: "Available",
    },
    {
      id: 2,
      name: "Superior Room",
      type: "deluxe",
      price: 399,
      image: "/luxury-hotel-executive-suite-with-living-area.jpg",
      features: ["Queen Bed", "Garden View", "Luxury Bathroom", "Mini Bar", "Smart TV"],
      rating: 4.7,
      reviews: 189,
      availability: "Available",
    },
    {
      id: 3,
      name: "Executive Suite",
      type: "suite",
      price: 599,
      image: "/luxury-hotel-executive-suite-with-living-area.jpg",
      features: ["2 Bedrooms", "Living Area", "Private Balcony", "Jacuzzi", "Concierge"],
      rating: 4.9,
      reviews: 156,
      availability: "Limited",
    },
    {
      id: 4,
      name: "Luxury Suite",
      type: "suite",
      price: 799,
      image: "/luxury-hotel-executive-suite-with-living-area.jpg",
      features: ["2 Bedrooms", "Dining Area", "Spa Bath", "Premium Minibar", "24/7 Service"],
      rating: 4.9,
      reviews: 134,
      availability: "Available",
    },
    {
      id: 5,
      name: "Presidential Suite",
      type: "presidential",
      price: 1299,
      image: "/luxury-hotel-executive-suite-with-living-area.jpg",
      features: ["3 Bedrooms", "Full Spa", "Panoramic View", "Private Elevator", "Chef Service"],
      rating: 5.0,
      reviews: 98,
      availability: "Available",
    },
    {
      id: 6,
      name: "Royal Suite",
      type: "presidential",
      price: 1599,
      image: "/luxury-hotel-executive-suite-with-living-area.jpg",
      features: ["3 Bedrooms", "Infinity Pool", "Rooftop Access", "Personal Butler", "Wine Cellar"],
      rating: 5.0,
      reviews: 76,
      availability: "Limited",
    },
  ]

  const filteredRooms = useMemo(() => {
    let filtered = allRooms

    if (selectedType) {
      filtered = filtered.filter((room) => room.type === selectedType)
    }

    filtered = filtered.filter((room) => room.price >= priceRange[0] && room.price <= priceRange[1])

    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating)
    }

    return filtered
  }, [selectedType, priceRange, sortBy])

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-tyco-navy to-tyco-navy-light text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Our Rooms & Suites</h1>
          <p className="text-xl text-white/80">Discover our collection of luxuriously appointed accommodations</p>
        </div>
      </section>

      {/* Main Content */}

      <div className="px-[4%]">
               <RoomsDisplay showFilters={true}  columns={2}   layout="grid"/>
               </div>


      {/* CTA Section */}
      <section className="py-16 mt-24 px-4 sm:px-6 lg:px-8 bg-tyco-navy text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Need Help Choosing?</h2>
          <p className="text-lg text-white/80 mb-8">
            Our concierge team is ready to assist you in finding the perfect room for your stay.
          </p>
          <Link href="/contact" className="btn-secondary inline-flex items-center gap-2">
            Contact Our Team <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
