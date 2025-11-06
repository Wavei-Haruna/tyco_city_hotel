import  Navbar  from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowRight, Wifi } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ScrollToTop } from "@/components/scroll-to-top"
import TestimonialCarousel from "@/components/testimonials"

export default function Home() {
  const featuredRooms = [
    {
      id: 1,
      name: "Deluxe Room",
      price: "$299",
      image: "/luxury-hotel-deluxe-room-with-city-view.jpg",
      features: ["King Bed", "City View", "Marble Bathroom"],
      rating: 4.8,
      reviews: 245,
    },
    {
      id: 2,
      name: "Executive Suite",
      price: "$599",
      image: "/luxury-hotel-executive-suite-with-living-area.jpg",
      features: ["2 Bedrooms", "Living Area", "Private Balcony"],
      rating: 4.9,
      reviews: 189,
    },
    {
      id: 3,
      name: "Presidential Suite",
      price: "$1,299",
      image: "/luxury-hotel-presidential-suite-with-panoramic-vie.jpg",
      features: ["3 Bedrooms", "Spa", "Panoramic View"],
      rating: 5.0,
      reviews: 156,
    },
  ]



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

                <h1 className="text-5xl tracking-tighter lg:text-6xl font-bold text-tyco-navy leading-tight">
                  Akwaaba to{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-tyco-red to-tyco-yellow">
                    Tyco Hotel
                  </span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Experience unparalleled luxury and hospitality. From world-class accommodations to exquisite dining,
                  every moment is crafted for your comfort.
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
                  <p className="text-2xl font-bold text-tyco-navy">500+</p>
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
                  src="/luxury-hotel-lobby-with-modern-architecture.jpg"
                  alt="Tyco Hotel Lobby"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 glass-card w-64">
                <p className="text-sm font-semibold text-tyco-navy mb-2">Award Winning</p>
                <p className="text-xs text-gray-600">Best Luxury Hotel 2024</p>
              </div>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {featuredRooms.map((room) => (
    <div
      key={room.id}
      className="group glass-card overflow-hidden hover:shadow-2xl"
    >
      <div className="relative h-64 overflow-hidden rounded-xl mb-4">
        <Image
          src={room.image || "/placeholder.svg"}
          alt={room.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full">
          <span className="text-sm font-semibold text-tyco-navy">
            {room.price}/night
          </span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-tyco-navy mb-2">{room.name}</h3>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-base font-medium text-gray-800">
          {room.rating} ★
        </span>
        <span className="text-sm text-gray-600">
          ({room.reviews} reviews)
        </span>
      </div>

      <ul className="space-y-2 mb-6">
        {room.features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-sm text-gray-600"
          >
            <Wifi className="w-4 h-4 text-tyco-red" />
            {feature}
          </li>
        ))}
      </ul>

      <Link href={`/rooms/${room.id}`} className="btn-primary w-full text-center">
        View Details
      </Link>
    </div>
  ))}
</div>



          <div className="text-center mt-12">
            <Link href="/rooms" className="btn-secondary inline-flex items-center gap-2">
              View All Rooms <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Experiences Section */}
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-tyco-navy mb-4">A Royal Experience</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Indulge in our world-class amenities and services designed to elevate your stay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experiences.map((exp, idx) => (
              <div key={idx} className="glass-card text-center hover:shadow-2xl group">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{exp.icon}</div>
                <h3 className="text-2xl font-bold text-tyco-navy mb-3">{exp.title}</h3>
                <p className="text-gray-600 mb-6">{exp.description}</p>
                <Link
                  href="/experiences"
                  className="text-tyco-red font-semibold hover:text-tyco-navy transition-colors inline-flex items-center gap-2"
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section> */}
       <TestimonialCarousel/>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-tyco-navy relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 right-20 w-96 h-96 bg-tyco-yellow/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Ready to Experience Luxury?</h2>
          <p className="text-xl text-white/80 mb-8">
            Book your stay today and discover why Tyco Hotel is the preferred choice for discerning travelers.
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
