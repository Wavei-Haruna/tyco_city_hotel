import  Navbar  from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowRight, Wifi } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ScrollToTop } from "@/components/scroll-to-top"
import TestimonialCarousel from "@/components/testimonials"
import { RoomsDisplay } from "@/components/RoomsDisplay"

export default function Home() {



  return (
    <main className="min-h-screen bg-gradient-to-b from-tyco-white via-white to-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-tyco-yellow/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-tyco-red/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">

                <h1 className="text-5xl tracking-tighter lg:text-5xl font-bold text-tyco-navy leading-tight">
                  Akwaaba to{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-tyco-red to-tyco-yellow">
                    Tyco City Hotel
                  </span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                 Tyco City provides a luxurious ambience and Our accommodations are designed for guests’ utmost comfort and convenience.
                  We have a room just for you. with full-service hotel stays to one-night experiences, ours is to make you feel like a King


                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/rooms" className="btn-primary inline-flex items-center justify-center gap-2">
                  Explore Rooms <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/booking" className="btn-secondary inline-flex items-center justify-center gap-2">
                  Book Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="glass-card text-center">
                  <p className="text-2xl font-bold text-tyco-navy">60+</p>
                  <p className="text-sm text-gray-600">Luxury Rooms</p>
                </div>
                <div className="glass-card text-center">
                  <p className="text-2xl font-bold text-tyco-navy">4.9★</p>
                  <p className="text-sm text-gray-600">Guest Rating</p>
                </div>
                <div className="glass-card text-center">
                  <p className="text-2xl font-bold text-tyco-navy">25+</p>
                  <p className="text-sm text-gray-600">Years Legacy</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-96 min-h-32">
              <div className="absolute inset-0 glass rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/slider.5.jpg"
                  alt="Tyco Hotel Lobby"
                  fill
                  className="object-cover"
                />
              </div>
              {/* <div className="absolute -bottom-6 -right-6 glass-card w-64">
                <p className="text-sm font-semibold text-tyco-navy mb-2">Award Winning</p>
                <p className="text-xs text-gray-600">Best Luxury Hotel 2024</p>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-tyco-navy mb-4">Featured Rooms</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our collection of meticulously designed rooms, each offering a unique blend of comfort and
              elegance.
            </p>
          </div>


          <RoomsDisplay showFilters={false} limit={3} layout="grid"/>



          <div className="text-center mt-12">
            <Link href="/rooms" className="btn-secondary inline-flex items-center gap-2">
              View All Rooms <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>


       <TestimonialCarousel/>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-tyco-navy relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 right-20 w-96 h-96 bg-tyco-yellow/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Experience Luxury?</h2>
          <p className="text-xl text-white/80 mb-8">
            Book your stay today and discover why Tyco City Hotel is the preferred choice for discerning travelers.
          </p>
          <Link href="/booking" className="btn-secondary inline-flex items-center gap-2 text-lg">
            Reserve Your Room <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* <Newsletter /> */}
      <Footer />
      <ScrollToTop />
    </main>
  )
}
