"use client";

import { useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Calendar,
  Bed,
  Users,
  MessageSquare,
  Star,
  LogOut,
  Menu,
  X,
  Hotel,
  Bell,
  ChevronDown,
  User,
  Plus,
} from "lucide-react";
import Image from "next/image";

interface DashboardLayoutProps {
  children: ReactNode;
}

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    label: "Reservations",
    icon: Calendar,
    href: "/admin/reservations",
  },
  {
    label: "Rooms",
    icon: Bed,
    href: "/admin/rooms",
  },
  {
    label: "Guests",
    icon: Users,
    href: "/admin/guests",
  },
  {
    label: "Reviews",
    icon: Star,
    href: "/admin/reviews",
  },
  {
    label: "Complaints",
    icon: MessageSquare,
    href: "/admin/complaints",
  },
];

export default function AdminDashboardLayout({
  children,
}: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gradient-to-b from-tyco-red to-tyco-navy shadow-xl hidden lg:block">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
          <div className="w-32 h-16 rounded-lg bg-white/20 flex items-center justify-center">
           <Image src="/tyco_logo.png" alt="Tyco City Logo"   width={40} height={40}/>
          </div>

        </div>

        {/* Navigation */}
        <nav className="px-3 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl
                         transition-all duration-300 group
                         ${
                           active
                             ? "bg-white text-tyco-red shadow-lg"
                             : "text-white/80 hover:bg-white/10 hover:text-white"
                         }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    active
                      ? "text-tyco-red"
                      : "text-white/70 group-hover:text-white"
                  }`}
                />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                     text-white/80 hover:bg-white/10 hover:text-white
                     transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 text-white/70 group-hover:text-white" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-tyco-red to-tyco-navy shadow-xl">
            {/* Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Image src="/tyco_logo.png" alt="Tyco City Logo"   width={40} height={40}/>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Tyco City</h1>
                <p className="text-white/70 text-xs">Admin Portal</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="px-3 py-6 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      router.push(item.href);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl
                             transition-all duration-300 group
                             ${
                               active
                                 ? "bg-white text-tyco-red shadow-lg"
                                 : "text-white/80 hover:bg-white/10 hover:text-white"
                             }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        active
                          ? "text-tyco-red"
                          : "text-white/70 group-hover:text-white"
                      }`}
                    />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                         text-white/80 hover:bg-white/10 hover:text-white
                         transition-all duration-300 group"
              >
                <LogOut className="w-5 h-5 text-white/70 group-hover:text-white" />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-4">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-tyco-red transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Logo/Title for mobile */}
              <div className="lg:hidden">
                <h2 className="text-lg font-bold text-tyco-navy">Tyco City Hotel</h2>
              </div>

              {/* Quick Action Buttons - Desktop */}
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => router.push("/admin/rooms/create")}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-tyco-red to-tyco-navy
                           text-white rounded-xl font-semibold text-sm shadow-md
                           hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <Bed className="w-4 h-4" />
                  <span>Create Room</span>
                </button>
                <button
                  onClick={() => router.push("/admin/reservations/create")}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-tyco-navy to-tyco-secondary
                           text-white rounded-xl font-semibold text-sm shadow-md
                           hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>New Reservation</span>
                </button>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Quick Actions Menu - Mobile */}
              <div className="md:hidden relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="p-2 rounded-xl bg-tyco-red text-white hover:bg-tyco-accent transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>

                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20">
                      <button
                        onClick={() => {
                          router.push("/admin/rooms/create");
                          setProfileOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        <Bed className="w-4 h-4 text-tyco-red" />
                        <span className="text-sm text-gray-700 font-medium">Create Room</span>
                      </button>
                      <button
                        onClick={() => {
                          router.push("/admin/reservations/create");
                          setProfileOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        <Calendar className="w-4 h-4 text-tyco-red" />
                        <span className="text-sm text-gray-700 font-medium">New Reservation</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-tyco-red rounded-full"></span>
              </button>

              {/* Profile Dropdown - Desktop */}
              <div className="hidden md:block relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-tyco-red to-tyco-navy flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-700">
                      Admin User
                    </p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-700">Admin User</p>
                        <p className="text-xs text-gray-500">admin@tycocity.com</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 mt-2"
                      >
                        <LogOut className="w-4 h-4 text-tyco-red" />
                        <span className="text-sm text-tyco-red font-medium">
                          Logout
                        </span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}