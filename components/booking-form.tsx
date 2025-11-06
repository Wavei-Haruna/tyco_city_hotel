"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Users, ArrowRight } from "lucide-react"

export function BookingForm() {
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "1",
    roomType: "deluxe",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Booking submitted:", formData)
  }

  return (
    <div className="glass-card max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-tyco-navy mb-6">Quick Booking</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-tyco-navy mb-2">Check-in</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-5 h-5 text-tyco-red" />
            <input
              type="date"
              name="checkIn"
              value={formData.checkIn}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tyco-yellow"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-tyco-navy mb-2">Check-out</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-5 h-5 text-tyco-red" />
            <input
              type="date"
              name="checkOut"
              value={formData.checkOut}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tyco-yellow"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-tyco-navy mb-2">Guests</label>
          <div className="relative">
            <Users className="absolute left-3 top-3 w-5 h-5 text-tyco-red" />
            <select
              name="guests"
              value={formData.guests}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tyco-yellow"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Guest" : "Guests"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-tyco-navy mb-2">Room Type</label>
          <select
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tyco-yellow"
          >
            <option value="deluxe">Deluxe</option>
            <option value="suite">Suite</option>
            <option value="presidential">Presidential</option>
          </select>
        </div>

        <button
          type="submit"
          className="md:col-span-2 lg:col-span-4 btn-primary inline-flex items-center justify-center gap-2"
        >
          Check Availability <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
