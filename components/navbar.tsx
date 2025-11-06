"use client"

import { useState } from "react"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { ChevronDown } from "lucide-react"
import Image from "next/image"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  const navItems = [
    { label: "Home", href: "/" },
    {
      label: "Rooms",
      href: "/rooms",
      submenu: [
        { label: "Deluxe Rooms", href: "/rooms?type=deluxe", description: "Luxury comfort" },
        { label: "Suite Rooms", href: "/rooms?type=suite", description: "Premium suites" },
        { label: "Presidential Suite", href: "/rooms?type=presidential", description: "Ultimate luxury" },
      ],
    },
    {
      label: "Experiences",
      href: "/experiences",
      submenu: [
        { label: "Dining", href: "/experiences#dining", description: "Fine cuisine" },
        { label: "Spa & Wellness", href: "/experiences#spa", description: "Relax & rejuvenate" },
        { label: "Recreation", href: "/experiences#recreation", description: "Activities & fun" },
      ],
    },
    { label: "Conferences", href: "/conferences" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ]

  const navbarVariants = {
    top: {
      backgroundColor: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(16px)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    },
    scrolled: {
      backgroundColor: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(20px)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
    },
  }

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  const mobileMenuVariants = {
    closed: { x: "100%" },
    open: { x: 0 },
  }

  const handleMobileNavClick = () => {
    setIsOpen(false)
    setActiveDropdown(null)
  }

  return (
    <>
      <motion.nav
        variants={navbarVariants}
        initial="top"
        animate={isScrolled ? "scrolled" : "top"}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled ? "border-[var(--color-border)]" : "border-white/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.a
              href="/"
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="relative w-12 h-12 rounded-xl overflow-hidden"
                whileHover={{ rotate: 5 }}
              >
                <Image
                  src="/tyco_logo.png"
                  alt="Tyco Hotel Logo"
                  fill
                  className="object-cover"
                />
              </motion.div>
              <div className="hidden sm:block">
                <div
                  className={`text-xl font-bold tracking-tight ${
                    isScrolled ? "text-[var(--color-tyco-navy)]" : "text-white"
                  }`}
                >
                  Tyco Hotel
                </div>
              </div>
            </motion.a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex flex-1 justify-center items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => item.submenu && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.submenu ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative px-4 py-2 font-medium rounded-lg flex items-center gap-1 transition-all duration-300 ${
                        isScrolled
                          ? "text-gray-900 hover:text-red-600 hover:bg-gray-100"
                          : "text-gray-900 hover:text-red-600 hover:bg-gray-100"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                          activeDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  ) : (
                    <motion.a
                      href={item.href}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative px-4 py-2 font-medium rounded-lg flex items-center gap-1 transition-all duration-300 ${
                        isScrolled
                          ? "text-gray-900 hover:text-red-600 hover:bg-gray-100"
                          : "text-gray-900 hover:text-red-600 hover:bg-gray-100"
                      }`}
                    >
                      {item.label}
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.a>
                  )}

                  {item.submenu && activeDropdown === item.label && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      className="absolute left-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden"
                    >
                      {item.submenu.map((subitem, subIndex) => (
                        <motion.a
                          key={subitem.label}
                          href={subitem.href}
                          className="block px-6 py-4 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-300 border-b border-gray-100 last:border-0 group"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: subIndex * 0.05 }}
                        >
                          <div className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                            {subitem.label}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{subitem.description}</div>
                        </motion.a>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Book Now */}
            <div className="hidden lg:block">
              <a
                href="/book"
                className="btn-primary px-6 py-3 font-semibold"
              >
                Book Now
              </a>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-lg ${
                isScrolled
                  ? "text-gray-900 hover:bg-gray-100"
                  : "text-gray-900 hover:bg-gray-100"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-2xl">{isOpen ? "✕" : "☰"}</span>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <motion.div
        variants={mobileMenuVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 bottom-0 w-80 bg-white/95 backdrop-blur-xl z-40 lg:hidden shadow-2xl overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="text-2xl font-bold text-gray-900">Menu</div>
            <motion.button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-900"
            >
              <span className="text-2xl">✕</span>
            </motion.button>
          </div>

          <div className="space-y-2">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.submenu ? (
                  <>
                    <button
                      onClick={() =>
                        setActiveDropdown(activeDropdown === item.label ? null : item.label)
                      }
                      className="w-full text-left px-4 py-3 text-gray-900 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 rounded-xl transition-all duration-300 flex justify-between items-center font-medium"
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          activeDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {activeDropdown === item.label && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="pl-6 space-y-1 mt-1 overflow-hidden"
                      >
                        {item.submenu.map((subitem) => (
                          <a
                            key={subitem.label}
                            href={subitem.href}
                            onClick={handleMobileNavClick}
                            className="block px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                          >
                            {subitem.label}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </>
                ) : (
                  <a
                    href={item.href}
                    onClick={handleMobileNavClick}
                    className="block w-full text-left px-4 py-3 text-gray-900 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 rounded-xl transition-all duration-300 font-medium"
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}

            <div className="pt-4">
              <a
                href="/book"
                onClick={handleMobileNavClick}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white w-full block text-center px-6 py-3 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </>
  )
}