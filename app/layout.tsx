import type React from "react"
import type { Metadata } from "next"
import { Titillium_Web } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const titillium = Titillium_Web({
  weight: ["200", "300", "400", "600", "700", "900"],
  subsets: ["latin"],
  variable: "--font-titillium",
})

export const metadata: Metadata = {
  title: "Tyco Hotel - Luxury Hospitality",
  description:
    "Experience luxury hospitality at Tyco Hotel. Premium rooms, world-class dining, and unforgettable experiences.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={titillium.variable}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
