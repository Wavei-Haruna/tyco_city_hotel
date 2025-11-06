'use client'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import TestimonialCard from '@/components/ui/TestimonialCard'
import { testimonialImages } from '@/assets/testimonial/_testimonials'
import { useCallback, useEffect, useState } from 'react'

// Testimonials Data
const testimonialsData = [
  {
    bgName: 'KWAME',
    image: testimonialImages.kwame,
    name: 'Kwame Asante',
    designation: 'CEO, Prime Logistics',
    testimonial:
      'Tyco City Hotel has become my preferred place to stay whenever I’m in Sunyani for business. The rooms are spacious, the Wi-Fi is reliable, and the service is always warm and professional.',
  },
  {
    bgName: 'ABENA',
    image: testimonialImages.abena,
    name: 'Abena Osei',
    designation: 'Founder, Green Harvest Farms',
    testimonial:
      'I spent a weekend at Tyco City Hotel for a business retreat, and it was worth every cedi. The environment was calm and refreshing — the perfect setting to recharge and plan for the next quarter.',
  },
  {
    bgName: 'MICHAEL',
    image: testimonialImages.michael,
    name: 'Michael Boateng',
    designation: 'Director, Tech Innovate Ltd',
    testimonial:
      'We hosted our annual staff dinner at Tyco City Hotel, and the experience was flawless. The banquet hall was elegant, the food excellent, and the staff handled everything smoothly.',
  },
  {
    bgName: 'SARAH',
    image: testimonialImages.sarah,
    name: 'Sarah Mensah',
    designation: 'Owner, Style & Grace Fashion House',
    testimonial:
      'Tyco City Hotel has a beautiful atmosphere and an unmatched attention to detail. From check-in to checkout, everything felt premium and effortless. I’ll definitely return soon.',
  },
  {
    bgName: 'YAW',
    image: testimonialImages.yaw,
    name: 'Yaw Ampofo',
    designation: 'MD, FreshMart Supermarkets',
    testimonial:
      'I recently stayed at Tyco City Hotel during a business conference, and I was impressed by their professionalism. The conference rooms are well-equipped, and the staff are always ready to assist.',
  },
];



const TestimonialCarousel = () => {
  // Initialize Embla carousel with AutoScroll plugin
  const [autoScrollOptions] = useState({ speed: 1 })
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      skipSnaps: false,
    },
    [AutoScroll(autoScrollOptions)]
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [autoScrollPlugin, setAutoScrollPlugin] = useState<{
    play: () => void
    stop: () => void
  } | null>(null)

  // Store the AutoScroll plugin instance when it's available
  useEffect(() => {
    if (!emblaApi) return

    const plugins = emblaApi.plugins()
    if (plugins?.autoScroll) {
      setAutoScrollPlugin(plugins.autoScroll)
    }
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on('select', onSelect)
    onSelect() // Set initial index

    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  // Function to navigate to the next slide
  const handleNext = useCallback(() => {
    if (!emblaApi) return

    // Temporarily stop auto-scrolling
    if (autoScrollPlugin) {
      autoScrollPlugin.stop()
    }

    // Scroll to next slide
    emblaApi.scrollNext()

    // Resume auto-scrolling after a slight delay
    setTimeout(() => {
      if (autoScrollPlugin) {
        autoScrollPlugin.play()
      }
    }, 1000)
  }, [emblaApi, autoScrollPlugin])

  // Function to navigate to the previous slide
  const handlePrev = useCallback(() => {
    if (!emblaApi) return

    // Temporarily stop auto-scrolling
    if (autoScrollPlugin) {
      autoScrollPlugin.stop()
    }

    // Scroll to previous slide
    emblaApi.scrollPrev()

    // Resume auto-scrolling after a slight delay
    setTimeout(() => {
      if (autoScrollPlugin) {
        autoScrollPlugin.play()
      }
    }, 1000)
  }, [emblaApi, autoScrollPlugin])

  return (
    <section className="overflow-hidden p-8 relative mb-8">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {testimonialsData.map((item, index) => (
            <div
              key={index}
              className="flex-none mx-6 h-[376px]" // Exact size match for the testimonial cards
            >
              <TestimonialCard
                bgName={item.bgName}
                designation={item.designation}
                testimonial={item.testimonial}
                image={item.image}
                name={item.name}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons for Desktop */}
      <div className="hidden lg:block">
        {/* Left Navigation Button */}
        <button
          onClick={handlePrev}
          className="absolute hidden z-50 cursor-pointer top-1/2 bg-white rounded-full shadow-md left-2 transform -translate-y-1/2 p-2.5 text-primary"
        >
          <img
            src={testimonialImages.rchevron}
            alt="Left Chevron"
            className="h-6 w-6 transform rotate-180"
          />
        </button>

        {/* Right Navigation Button */}
        <button
          onClick={handleNext}
          className="absolute z-50 cursor-pointer top-1/2 bg-white rounded-full shadow-md right-2 transform -translate-y-1/2 p-2.5 text-primary"
        >
          <img src={testimonialImages.rchevron} alt="Right Chevron" className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Pagination Dots */}
      <div className="flex justify-center gap-2 mt-6 sm:hidden bg-gray-200 w-fit py-2.5 px-5 rounded-full mx-auto">
        {testimonialsData.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (autoScrollPlugin) autoScrollPlugin.stop()
              emblaApi?.scrollTo(index)
              setTimeout(() => {
                if (autoScrollPlugin) autoScrollPlugin.play()
              }, 1000)
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === selectedIndex ? 'bg-[#262626]' : 'bg-gray-300'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default TestimonialCarousel
