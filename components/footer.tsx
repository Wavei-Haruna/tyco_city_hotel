'use client';

import type React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Send,
  Sparkles,
  ArrowUpRight,
  Utensils,
  Dumbbell,
  CalendarCheck,
  Camera,
} from 'lucide-react';
import { motion } from 'framer-motion';

const logoSrc = '/tyco_logo.png';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/rooms', label: 'Rooms & Suites' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/conferences', label: 'Conferences' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact Us' },
];

const services = [
  { href: '/experiences#dining', label: 'Fine Dining', icon: <Utensils className="h-3 w-3" /> },

  { href: '/experiences#recreation', label: 'Recreation', icon: <Camera className="h-3 w-3" /> },
  { href: '/booking', label: 'Book Now', icon: <CalendarCheck className="h-3 w-3" /> },
  { href: '/rooms?type=deluxe', label: 'Deluxe Rooms', disabled: false },
  { href: '/rooms?type=suite', label: 'Suite Rooms', disabled: false },
];

const socialLinks = [
  {
    href: '#',
    icon: Facebook,
    label: 'Facebook',
    color: 'hover:text-blue-400',
    brandColor: '#1877F2',
  },
  {
    href: '#',
    icon: Instagram,
    label: 'Instagram',
    color: 'hover:text-pink-400',
    brandColor: '#E4405F',
  },
  {
    href: '#',
    icon: Twitter,
    label: 'Twitter',
    color: 'hover:text-sky-400',
    brandColor: '#1DA1F2',
  },
  {
    href: '#',
    icon: Linkedin,
    label: 'LinkedIn',
    color: 'hover:text-blue-500',
    brandColor: '#0A66C2',
  },
];

const contactInfo = [
  { icon: Phone, text: '+1 (234) 567-890', href: 'tel:+1234567890' },
  { icon: Mail, text: 'info@tycohotel.com', href: 'mailto:info@tycohotel.com' },
  { icon: MapPin, text: '123 Luxury Avenue, City, Country', href: '#' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-white text-slate-900 overflow-hidden">
      {/* Background Aurora Effect - Tyco Colors */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_rgba(220,38,38,0.15)_0%,_transparent_40%),radial-gradient(circle_at_80%_70%,_rgba(250,204,21,0.1)_0%,_transparent_40%)]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

      {/* Top Border Gradient - Tyco Colors */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#dc2626] via-[#facc15] to-[#dc2626] opacity-80" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8"
        >
          {/* Brand & Newsletter Section */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <div className="mb-8">
              <Link href="/" className="flex items-center gap-3 mb-4 group">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border-2 border-[#facc15]/50 group-hover:scale-110 group-hover:border-[#facc15] transition-all duration-300 shadow-md">
                  <Image
                    src={logoSrc}
                    alt="Tyco Hotel Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#dc2626] via-[#facc15] to-[#dc2626] bg-clip-text text-transparent">
                    Tyco City Hotel
                  </h2>
                  <p className="text-xs text-slate-600">Luxury Redefined</p>
                </div>
              </Link>
              <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
                Experience world-class hospitality where luxury meets comfort. Your perfect escape awaits with exceptional service, elegant accommodations, and unforgettable experiences.
              </p>
            </div>

            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-900 flex items-center">
                <Send className="h-4 w-4 mr-2 text-[#dc2626]" />
                Subscribe for Exclusive Offers
              </h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-[#dc2626] transition-all"
                />
                <button className="px-4 py-2.5 bg-gradient-to-br from-[#dc2626] to-[#b91c1c] text-white hover:from-[#b91c1c] hover:to-[#991b1b] transition-all duration-300 rounded-lg shrink-0 font-medium shadow-md">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Links Sections */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-semibold text-slate-900 mb-6 flex items-center">
                <div className="w-1 h-4 bg-gradient-to-b from-[#dc2626] to-[#facc15] mr-2 rounded-full" />
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center text-sm text-slate-600 hover:text-[#dc2626] transition-all duration-300"
                    >
                      <ChevronRight className="h-3 w-3 mr-2 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#dc2626]" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-semibold text-slate-900 mb-6 flex items-center">
                <div className="w-1 h-4 bg-gradient-to-b from-[#dc2626] to-[#facc15] mr-2 rounded-full" />
                Our Services
              </h3>
              <ul className="space-y-3">
                {services.map((link) => (
                  <li key={link.href} className="relative group">
                    <Link
                      href={link.href}
                      className="group/link flex items-center text-sm text-slate-600 hover:text-[#dc2626] transition-all duration-300"
                    >
                      <ChevronRight className="h-3 w-3 mr-2 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300 text-[#dc2626]" />
                      <span className="flex items-center">
                        {link.icon && <span className="mr-1.5 text-[#dc2626]">{link.icon}</span>}
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="col-span-2 md:col-span-2">
              <h3 className="text-sm font-semibold text-slate-900 mb-6 flex items-center">
                <div className="w-1 h-4 bg-gradient-to-b from-[#dc2626] to-[#facc15] mr-2 rounded-full" />
                Get in Touch
              </h3>
              <div className="space-y-4 mb-8">
                {contactInfo.map((contact, index) => (
                  <a key={index} href={contact.href} className="flex items-center gap-3 group">
                    <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg group-hover:bg-[#dc2626]/5 group-hover:border-[#dc2626]/30 transition-all duration-300">
                      <contact.icon className="h-4 w-4 text-[#dc2626] flex-shrink-0" />
                    </div>
                    <span className="text-sm text-slate-600 group-hover:text-[#dc2626] transition-colors">
                      {contact.text}
                    </span>
                  </a>
                ))}
              </div>

              <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-[#dc2626]" />
                Connect With Us
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 hover:border-[#dc2626]/50 transition-all duration-300 group"
                    style={{ '--brand-color': social.brandColor } as React.CSSProperties}
                  >
                    <div className="absolute -inset-px rounded-lg bg-gradient-to-br from-[#dc2626] to-[#facc15] opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
                    <social.icon className="h-5 w-5 text-slate-600 group-hover:text-[#dc2626] transition-colors relative z-10" />
                    <span className="sr-only">{social.label}</span>
                  </a>
                ))}
              </div>


            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-slate-200"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-slate-600">
            <p>
              &copy; {currentYear} Tyco City Hotel. All Rights Reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-[#dc2626] transition-colors">
                Privacy Policy
              </Link>
              <span className="text-slate-300">|</span>
              <Link href="/terms" className="hover:text-[#dc2626] transition-colors">
                Terms of Service
              </Link>
              <span className="text-slate-300">|</span>
              <Link href="/sitemap" className="hover:text-[#dc2626] transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}