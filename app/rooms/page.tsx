"use client"

import { useState, useMemo } from "react"
import Navbar  from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Star, Filter, ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="glass-card sticky top-24">
                <h3 className="text-xl font-bold text-tyco-navy mb-6 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h3>

                {/* Room Type Filter */}
                <div className="mb-8">
                  <h4 className="font-semibold text-tyco-navy mb-4">Room Type</h4>
                  <div className="space-y-3">
                    {[
                      { value: null, label: "All Rooms" },
                      { value: "deluxe", label: "Deluxe Rooms" },
                      { value: "suite", label: "Suite Rooms" },
                      { value: "presidential", label: "Presidential Suite" },
                    ].map((type) => (
                      <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="radio"
                          name="room-type"
                          value={type.value || ""}
                          checked={selectedType === type.value}
                          onChange={() => setSelectedType(type.value)}
                          className="w-4 h-4 accent-tyco-yellow"
                        />
                        <span className="text-gray-700 group-hover:text-tyco-navy transition-colors">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-8">
                  <h4 className="font-semibold text-tyco-navy mb-4">Price Range</h4>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full accent-tyco-yellow"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h4 className="font-semibold text-tyco-navy mb-4">Sort By</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tyco-yellow"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Rooms Grid */}
            <div className="lg:col-span-3">
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600">
                  Showing <span className="font-semibold text-tyco-navy">{filteredRooms.length}</span> rooms
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredRooms.map((room) => (
                  <div key={room.id} className="glass-card overflow-hidden hover:shadow-2xl group">
                    <div className="relative h-64 overflow-hidden rounded-xl mb-4">
                      <Image
                        src={room.image || "/placeholder.svg"}
                        alt={room.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full">
                        <span className="text-sm font-semibold text-tyco-navy">${room.price}/night</span>
                      </div>
                      <div className="absolute top-4 left-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            room.availability === "Available"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {room.availability}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-tyco-navy mb-2">{room.name}</h3>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(room.rating) ? "fill-tyco-yellow text-tyco-yellow" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({room.reviews})</span>
                    </div>

                    <ul className="space-y-2 mb-6">
                      {room.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="w-4 h-4 text-tyco-red" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="flex gap-3">
                      <Link href={`/rooms/${room.id}`} className="flex-1 btn-primary text-center text-sm">
                        View Details
                      </Link>
                      <Link href="/booking" className="flex-1 btn-secondary text-center text-sm">
                        Book Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {filteredRooms.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600 mb-4">No rooms found matching your criteria</p>
                  <button
                    onClick={() => {
                      setSelectedType(null)
                      setPriceRange([0, 2000])
                    }}
                    className="btn-primary"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-tyco-navy text-white">
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
