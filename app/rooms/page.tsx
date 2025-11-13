"use client"
import Navbar  from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowRight, } from "lucide-react"
import Link from "next/link"

import { RoomsDisplay } from "@/components/RoomsDisplay"

export default function RoomsPage() {





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
               <RoomsDisplay showFilters={true}  columns={3}   layout="list"/>
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
