"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // Updated navItems: No dropdowns for Rooms and Experiences
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Rooms", href: "/rooms" },
    { label: "Conferences", href: "/conferences" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];

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
  };

  const mobileMenuVariants = {
    closed: { x: "100%" },
    open: { x: 0 },
  };

  const handleMobileNavClick = () => {
    setIsOpen(false);
  };

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
                  className={`text-xl font-header font-bold tracking-tight ${
                    isScrolled ? "text-[var(--color-tyco-navy)]" : "text-tyco-red"
                  }`}
                >
                  Tyco City Hotel
                </div>
              </div>
            </motion.a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex flex-1 justify-center items-center gap-1">
              {navItems.map((item) => (
                <motion.a
                  key={item.label}
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
              ))}
            </div>

            {/* Book Now */}
            <div className="hidden lg:block">
              <a href="/booking" className="btn-primary px-6 py-3 font-semibold">
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
              <a
                key={item.label}
                href={item.href}
                onClick={handleMobileNavClick}
                className="block w-full text-left px-4 py-3 text-gray-900 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 rounded-xl transition-all duration-300 font-medium"
              >
                {item.label}
              </a>
            ))}

            <div className="pt-4">
              <a
                href="/booking"
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
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
        />
      )}
    </>
  );
}
