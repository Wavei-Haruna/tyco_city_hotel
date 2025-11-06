"use client"

import type React from "react"

import { useState } from "react"
import { Mail, ArrowRight } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setEmail("")
      setSubmitted(false)
    }, 3000)
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-tyco-navy to-tyco-navy-light text-white">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-white/80 mb-8">Subscribe to our newsletter for exclusive offers and updates.</p>

        {submitted ? (
          <div className="bg-green-500/20 border border-green-400 rounded-lg p-4 text-green-100">
            Thank you for subscribing!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-3 w-5 h-5 text-tyco-yellow" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-tyco-yellow text-tyco-navy"
              />
            </div>
            <button type="submit" className="btn-secondary inline-flex items-center gap-2">
              Subscribe <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
