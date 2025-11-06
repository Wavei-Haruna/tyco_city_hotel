import { Footer } from "@/components/footer"
import { ArrowRight, Users, Projector, Wifi, Asterisk as Catering } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/navbar"

export default function ConferencesPage() {
  const spaces = [
    {
      name: "Grand Ballroom",
      capacity: "500+",
      image: "/luxury-hotel-executive-suite-with-living-area.jpg",
      features: ["Theater Setup", "Breakout Rooms", "AV Equipment", "Catering"],
    },
    {
      name: "Executive Boardroom",
      capacity: "50",
      image: "/luxury-hotel-executive-suite-with-living-area.jpg",
      features: ["Video Conferencing", "High-Speed WiFi", "Premium Seating", "Refreshments"],
    },
    {
      name: "Innovation Hub",
      capacity: "200",
      image: "/luxury-hotel-executive-suite-with-living-area.jpg",
      features: ["Flexible Layout", "Tech Integration", "Natural Light", "Breakout Areas"],
    },
    {
      name: "Seminar Suites",
      capacity: "100",
      image: "/luxury-hotel-executive-suite-with-living-area.jpg",
      features: ["Modular Setup", "Sound System", "Projection", "Networking Space"],
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-tyco-navy to-tyco-navy-light text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Conferencing Redefined</h1>
          <p className="text-xl text-white/80">World-class venues for your most important events</p>
        </div>
      </section>

      {/* Spaces Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {spaces.map((space, idx) => (
              <div key={idx} className="glass-card overflow-hidden hover:shadow-2xl group">
                <div className="relative h-64 overflow-hidden rounded-xl mb-4">
                  <Image
                    src={space.image || "/placeholder.svg"}
                    alt={space.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 glass px-4 py-2 rounded-full">
                    <span className="text-sm font-semibold text-tyco-navy">Capacity: {space.capacity}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-tyco-navy mb-4">{space.name}</h3>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {space.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-tyco-red rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                <Link href="/contact" className="btn-primary w-full text-center">
                  Send Inquiry
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-tyco-navy mb-12 text-center">Conference Services</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Users, title: "Event Planning", desc: "Expert coordination for seamless events" },
              { icon: Projector, title: "AV & Tech", desc: "Latest technology and equipment" },
              { icon: Wifi, title: "Connectivity", desc: "High-speed internet throughout" },
              { icon: Catering, title: "Catering", desc: "Customized menu options" },
            ].map((service, idx) => {
              const IconComponent = service.icon
              return (
                <div key={idx} className="glass-card text-center">
                  <IconComponent className="w-12 h-12 text-tyco-red mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-tyco-navy mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-tyco-navy text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Plan Your Event Today</h2>
          <p className="text-lg text-white/80 mb-8">
            Let our team help you create an unforgettable conference experience.
          </p>
          <Link href="/contact" className="btn-secondary inline-flex items-center gap-2">
            Get in Touch <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
