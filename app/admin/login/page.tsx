"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Mail, Loader2, } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Check if user is admin (you can add custom claims check here)
      toast.success("Welcome back, Admin!");
      router.push("/admin");
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle specific error codes
      if (error.code === "auth/invalid-credential") {
        toast.error("Invalid email or password");
      } else if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many failed attempts. Please try again later");
      } else {
        toast.error("Login failed. Please try again");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-tyco-red via-tyco-secondary to-tyco-red-dark p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-tyco-yellow/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-tyco-red/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Login Card */}
        <div className="glass p-8 rounded-2xl shadow-2xl backdrop-blur-xl bg-white/95 border border-white/20">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-tyco-yellow to-tyco-red mb-4 shadow-lg">
              <Image src="/tyco_logo.png" alt="Tyco City Hotel Logo" width={70} height={40} />
            </div>
            <h1 className="text-3xl font-bold text-tyco-navy mb-2">
              Admin Portal
            </h1>
            <p className="text-gray-600 text-sm">
              Tyco City Hotel Management System
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-tyco-navy mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="admin@tycocityhotel.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-tyco-border bg-white
                           focus:ring-2 focus:ring-tyco-yellow focus:border-transparent
                           outline-none transition-all duration-300 text-tyco-navy
                           placeholder:text-gray-400"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-tyco-navy text-xs mt-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-tyco-red rounded-full"></span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-tyco-navy mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-tyco-border bg-white
                           focus:ring-2 focus:ring-tyco-yellow focus:border-transparent
                           outline-none transition-all duration-300 text-tyco-navy
                           placeholder:text-gray-400"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                           hover:text-tyco-navy transition-colors duration-300"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-tyco-navy text-xs mt-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-tyco-red rounded-full"></span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-tyco-yellow
                           focus:ring-tyco-yellow focus:ring-offset-0"
                />
                <span className="text-gray-600 group-hover:text-tyco-navy transition-colors">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-tyco-navy hover:text-tyco-accent font-medium transition-colors"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-tyco-red to-tyco-secondary
                       text-white py-3 rounded-xl font-semibold shadow-lg
                       hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                       flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Protected by Tyco City Hotel Security
            </p>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-6 text-center text-sm text-white/80">
          <p>Need help? Contact IT Support</p>
          <p className="font-semibold mt-1">+233-540-122-324
</p>
        </div>
      </div>
    </div>
  );
}