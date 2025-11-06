import  Navbar  from "@/components/navbar"
import { Footer } from "@/components/footer"
import { BookingForm } from "@/components/booking-form"

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-tyco-navy mb-4">Book Your Stay</h1>
            <p className="text-xl text-gray-600">Secure your reservation at Tyco Hotel</p>
          </div>

          <BookingForm />
        </div>
      </section>

      <Footer />
    </main>
  )
}
