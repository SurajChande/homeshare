"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star, Users, Building2, Shield } from "lucide-react";

const stats = [
  { label: "Societies", value: "2,400+", icon: Building2 },
  { label: "Residents", value: "180K+", icon: Users },
  { label: "Avg Rating", value: "4.9★", icon: Star },
];

const floatingCards = [
  {
    id: 1,
    title: "Maintenance Paid",
    subtitle: "Flat 4B – ₹4,500",
    color: "from-emerald-400 to-teal-500",
    delay: 0,
    position: "top-[15%] left-[2%]",
    icon: "✓",
  },
  {
    id: 2,
    title: "Visitor Arrived",
    subtitle: "John at Gate A",
    color: "from-violet-400 to-indigo-500",
    delay: 0.3,
    position: "top-[10%] right-[0%]",
    icon: "🚪",
  },
  {
    id: 3,
    title: "New Notice",
    subtitle: "Water supply cut on Sunday",
    color: "from-amber-400 to-orange-500",
    delay: 0.6,
    position: "bottom-[20%] left-[0%]",
    icon: "📢",
  },
  {
    id: 4,
    title: "Committee Meeting",
    subtitle: "Tomorrow, 6 PM – Club House",
    color: "from-cyan-400 to-blue-500",
    delay: 0.9,
    position: "bottom-[15%] right-[2%]",
    icon: "📅",
  },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white pt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-100 rounded-full blur-[100px] opacity-50" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-sm font-medium text-indigo-700 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Trusted by 2,400+ housing societies
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-slate-900 mb-6"
            >
              Your Society.{" "}
              <span className="gradient-text">Connected.</span>
              <br />
              Organized.{" "}
              <span className="gradient-text">Effortless.</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-500 leading-relaxed mb-10 max-w-lg"
            >
              HomeShare is the all-in-one platform for housing societies. Manage maintenance, 
              notices, visitors, and community — beautifully, from any device.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <a
                href="/auth/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all duration-200 group"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-2xl hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200"
              >
                See how it works
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-8"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                  <span className="text-sm text-slate-500">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Phone mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center items-center min-h-[520px]"
          >
            {/* Phone shell */}
            <div className="relative w-72 h-[580px] bg-slate-900 rounded-[48px] shadow-2xl shadow-slate-400/40 p-3 z-10">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-slate-900 rounded-b-2xl z-20" />
              {/* Screen */}
              <div className="w-full h-full bg-gradient-to-br from-indigo-50 via-white to-violet-50 rounded-[38px] overflow-hidden">
                {/* App header */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 pt-10 pb-5">
                  <p className="text-indigo-200 text-xs">Good morning,</p>
                  <p className="text-white font-bold text-lg">Rajesh Kumar 👋</p>
                  <p className="text-indigo-200 text-xs mt-0.5">Sunrise Towers, Flat 4B</p>
                </div>

                {/* Cards in app */}
                <div className="px-4 py-4 space-y-3">
                  {[
                    { emoji: "💰", label: "Maintenance Due", value: "₹4,500", color: "text-red-500", bg: "bg-red-50" },
                    { emoji: "📢", label: "New Notices", value: "3 unread", color: "text-amber-600", bg: "bg-amber-50" },
                    { emoji: "🚪", label: "Visitors Today", value: "2 pending", color: "text-indigo-600", bg: "bg-indigo-50" },
                    { emoji: "🔧", label: "Complaints", value: "1 open", color: "text-slate-600", bg: "bg-slate-50" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-3 p-3 ${item.bg} rounded-2xl`}
                    >
                      <span className="text-xl">{item.emoji}</span>
                      <div className="flex-1">
                        <p className="text-xs text-slate-500">{item.label}</p>
                        <p className={`text-sm font-semibold ${item.color}`}>{item.value}</p>
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    </div>
                  ))}
                </div>

                {/* Bottom nav */}
                <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg flex justify-around py-3 px-2">
                  {["🏠", "📋", "💬", "👤"].map((icon, i) => (
                    <button
                      key={i}
                      className={`flex flex-col items-center text-lg ${i === 0 ? "opacity-100" : "opacity-40"}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating notification cards */}
            {floatingCards.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + card.delay }}
                className={`absolute ${card.position} z-20`}
              >
                <div className="glass rounded-2xl px-4 py-3 shadow-xl min-w-[160px]">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{card.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{card.title}</p>
                      <p className="text-[10px] text-slate-500">{card.subtitle}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20"
            >
              <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-xl border border-slate-100">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-medium text-slate-700">SOC2 Compliant</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
