"use client"

import type React from "react"

import { useState } from "react"
import  Navbar  from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-tyco-navy to-tyco-navy-light text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-white/80">We'd love to hear from you. Reach out to us anytime.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Info Cards */}
            {[
              {
                icon: Phone,
                title: "Phone",
                content: "+1 (234) 567-890",
                subtext: "Available 24/7",
              },
              {
                icon: Mail,
                title: "Email",
                content: "info@tycohotel.com",
                subtext: "Response within 2 hours",
              },
              {
                icon: MapPin,
                title: "Address",
                content: "123 Luxury Avenue",
                subtext: "City, Country 12345",
              },
            ].map((item, idx) => {
              const IconComponent = item.icon
              return (
                <div key={idx} className="glass-card text-center">
                  <IconComponent className="w-12 h-12 text-tyco-red mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-tyco-navy mb-2">{item.title}</h3>
                  <p className="font-semibold text-tyco-navy mb-1">{item.content}</p>
                  <p className="text-sm text-gray-600">{item.subtext}</p>
                </div>
              )
            })}
          </div>

          {/* Contact Form & Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="glass-card">
              <h2 className="text-3xl font-bold text-tyco-navy mb-6">Send us a Message</h2>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <p className="text-green-700 font-semibold mb-2">Thank you for your message!</p>
                  <p className="text-green-600 text-sm">We'll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tyco-yellow"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tyco-yellow"
                    />
                  </div>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tyco-yellow"
                  />

                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tyco-yellow"
                  >
                    <option value="">Select Subject</option>
                    <option value="booking">Booking Inquiry</option>
                    <option value="event">Event Planning</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>

                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-tyco-yellow resize-none"
                  ></textarea>

                  <button type="submit" className="btn-primary w-full inline-flex items-center justify-center gap-2">
                    Send Message <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Info & Hours */}
            <div className="space-y-6">
              <div className="glass-card">
                <h3 className="text-2xl font-bold text-tyco-navy mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-tyco-red" />
                  Business Hours
                </h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-semibold">8:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-semibold">9:00 AM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold">9:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span>24/7 Concierge</span>
                    <span className="font-semibold text-tyco-red">Always Available</span>
                  </div>
                </div>
              </div>

              <div className="glass-card">
                <h3 className="text-2xl font-bold text-tyco-navy mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/rooms" className="text-tyco-red hover:text-tyco-navy transition-colors">
                      → Browse Rooms
                    </a>
                  </li>
                  <li>
                    <a href="/experiences" className="text-tyco-red hover:text-tyco-navy transition-colors">
                      → Explore Experiences
                    </a>
                  </li>
                  <li>
                    <a href="/conferences" className="text-tyco-red hover:text-tyco-navy transition-colors">
                      → Conference Spaces
                    </a>
                  </li>
                  <li>
                    <a href="/booking" className="text-tyco-red hover:text-tyco-navy transition-colors">
                      → Make a Booking
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
