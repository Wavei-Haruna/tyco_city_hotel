import  Navbar  from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ArrowRight, Utensils, Space as Spa, Dumbbell, Wine } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ExperiencesPage() {
  const experiences = [
    {
      id: 1,
      title: "Fine Dining",
      description: "Indulge in culinary excellence at our Michelin-starred restaurant",
      image: "/placeholder.svg?key=dining1",
      icon: Utensils,
      details: ["Award-winning chefs", "International cuisine", "Wine pairing service", "Private dining available"],
    },
    {
      id: 2,
      title: "Spa & Wellness",
      description: "Rejuvenate your mind, body, and soul with our premium spa treatments",
      image: "/placeholder.svg?key=spa1",
      icon: Spa,
      details: ["Holistic treatments", "Thermal pools", "Yoga & meditation", "Personal wellness coaching"],
    },
    {
      id: 3,
      title: "Recreation & Fitness",
      description: "Stay active with our state-of-the-art fitness facilities",
      image: "/placeholder.svg?key=fitness1",
      icon: Dumbbell,
      details: ["Modern gym equipment", "Personal trainers", "Swimming pool", "Tennis courts"],
    },
    {
      id: 4,
      title: "Wine Cellar & Bar",
      description: "Explore our curated collection of premium wines and spirits",
      image: "/placeholder.svg?key=wine1",
      icon: Wine,
      details: ["Rare wine collection", "Expert sommeliers", "Tasting events", "Cocktail masterclasses"],
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-tyco-navy to-tyco-navy-light text-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">A Royal Experience</h1>
          <p className="text-xl text-white/80">Discover world-class amenities and unforgettable moments</p>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {experiences.map((exp) => {
              const IconComponent = exp.icon
              return (
                <div key={exp.id} className="group">
                  <div className="relative h-80 overflow-hidden rounded-2xl mb-6 glass-card">
                    <Image
                      src={exp.image || "/placeholder.svg"}
                      alt={exp.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-tyco-navy/80 to-transparent flex items-end p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 glass rounded-xl flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-tyco-red" />
                        </div>
                        <h3 className="text-3xl font-bold text-white">{exp.title}</h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-lg text-gray-600 mb-6">{exp.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {exp.details.map((detail) => (
                      <div key={detail} className="glass px-4 py-3 rounded-lg">
                        <p className="text-sm font-semibold text-tyco-navy">{detail}</p>
                      </div>
                    ))}
                  </div>

                  <Link href="/booking" className="btn-primary inline-flex items-center gap-2">
                    Reserve Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-tyco-navy mb-12 text-center">Why Choose Our Experiences</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Expert Staff",
                description: "Our highly trained professionals ensure exceptional service at every touchpoint",
              },
              {
                title: "Premium Quality",
                description: "We use only the finest ingredients and materials for all our services",
              },
              {
                title: "Personalized Service",
                description: "Every experience is tailored to your preferences and needs",
              },
            ].map((item, idx) => (
              <div key={idx} className="glass-card text-center">
                <h3 className="text-2xl font-bold text-tyco-navy mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
