// Updated Contact Page with Framer Motion Scroll Animations

"use client"

import type React from "react"
import { useState } from "react"
import Navbar from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import { motion } from "framer-motion"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
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
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-tyco-navy to-tyco-navy-light text-white"
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-white/80">We'd love to hear from you. Reach out to us anytime.</p>
        </div>
      </motion.section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Contact Cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          >
            {[
              {
                icon: Phone,
                title: "Phone",
                content: "+233 540 122 324",
                subtext: "Front Desk • 24/7",
              },
              {
                icon: Mail,
                title: "Email",
                content: "info@tycocityhotel.com",
                subtext: "Typically replies within 2 hours",
              },
              {
                icon: MapPin,
                title: "Address",
                content: "Off the Kumasi–Sunyani Road, Alaska Junction",
                subtext: "Bono Region, Ghana",
              },
            ].map((item, idx) => {
              const IconComponent = item.icon
              return (
                <motion.div key={idx} variants={fadeUp} className="glass-card text-center">
                  <IconComponent className="w-12 h-12 text-tyco-red mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-tyco-navy mb-2">{item.title}</h3>
                  <p className="font-semibold text-tyco-navy mb-1">{item.content}</p>
                  <p className="text-sm text-gray-600">{item.subtext}</p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Form + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Form */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="glass-card"
            >
              <h2 className="text-3xl font-bold text-tyco-navy mb-6">Send us a Message</h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
                >
                  <p className="text-green-700 font-semibold mb-2">Thank you for your message!</p>
                  <p className="text-green-600 text-sm">We'll get back to you shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.input
                      variants={fadeUp}
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyco-yellow"
                    />
                    <motion.input
                      variants={fadeUp}
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyco-yellow"
                    />
                  </motion.div>

                  <motion.input
                    variants={fadeUp}
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyco-yellow"
                  />

                  <motion.select
                    variants={fadeUp}
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyco-yellow"
                  >
                    <option value="">Select Subject</option>
                    <option value="booking">Booking Inquiry</option>
                    <option value="event">Event Planning</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </motion.select>

                  <motion.textarea
                    variants={fadeUp}
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-tyco-yellow resize-none"
                  ></motion.textarea>

                  <motion.button
                    variants={fadeUp}
                    type="submit"
                    className="btn-primary w-full inline-flex items-center justify-center gap-2"
                  >
                    Send Message <Send className="w-4 h-4" />
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* Info Section */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="space-y-6"
            >
              <motion.div variants={fadeUp} className="glass-card">
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
              </motion.div>

              <motion.div variants={fadeUp} className="glass-card">
                <h3 className="text-2xl font-bold text-tyco-navy mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/rooms" className="text-tyco-red hover:text-tyco-navy transition-colors"> → Browse Rooms </a>
                  </li>
                  <li>
                    <a href="/experiences" className="text-tyco-red hover:text-tyco-navy transition-colors"> → Explore Experiences </a>
                  </li>
                  <li>
                    <a href="/conferences" className="text-tyco-red hover:text-tyco-navy transition-colors"> → Conference Spaces </a>
                  </li>
                  <li>
                    <a href="/booking" className="text-tyco-red hover:text-tyco-navy transition-colors"> → Make a Booking </a>
                  </li>
                </ul>
              </motion.div>

            </motion.div>

          </div>
        </div>
      </section>
ss
      <Footer />
    </main>
  )
}