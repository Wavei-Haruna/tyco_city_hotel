"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 glass-card w-12 h-12 flex items-center justify-center hover:shadow-lg transition-all duration-300"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6 text-tyco-navy" />
        </button>
      )}
    </>
  )
}
