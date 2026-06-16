"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const screens = [
  {
    id: "dashboard",
    label: "Dashboard",
    emoji: "🏠",
    title: "Everything at a glance",
    description:
      "Residents and admins get a personalised dashboard — dues, notices, visitors, and community updates front and centre.",
    accent: "from-indigo-500 to-violet-600",
    items: [
      { label: "Maintenance Due", value: "₹4,500", color: "text-red-500", bg: "bg-red-50" },
      { label: "Unread Notices", value: "3", color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Visitors Pending", value: "2", color: "text-indigo-600", bg: "bg-indigo-50" },
      { label: "Open Complaints", value: "1", color: "text-slate-600", bg: "bg-slate-50" },
    ],
  },
  {
    id: "maintenance",
    label: "Maintenance",
    emoji: "💰",
    title: "Billing without the headache",
    description:
      "Auto-generate and send bills to all flats. Track who paid, who hasn't, and collect payments online in seconds.",
    accent: "from-emerald-500 to-teal-600",
    items: [
      { label: "Total Collected", value: "₹2.4L", color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Pending Dues", value: "₹38,000", color: "text-red-500", bg: "bg-red-50" },
      { label: "Flats Paid", value: "84/96", color: "text-indigo-600", bg: "bg-indigo-50" },
      { label: "This Month", value: "June 2026", color: "text-slate-600", bg: "bg-slate-50" },
    ],
  },
  {
    id: "visitors",
    label: "Visitor Gate",
    emoji: "🚪",
    title: "Security that actually works",
    description:
      "Pre-approve guests, deliveries, and domestic help. Security validates with a tap — no paper logs needed.",
    accent: "from-violet-500 to-indigo-600",
    items: [
      { label: "Approved Today", value: "12", color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Awaiting Approval", value: "2", color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Deliveries", value: "5", color: "text-indigo-600", bg: "bg-indigo-50" },
      { label: "Denied Entry", value: "0", color: "text-slate-600", bg: "bg-slate-50" },
    ],
  },
  {
    id: "notices",
    label: "Notices",
    emoji: "📢",
    title: "Notices everyone actually reads",
    description:
      "Post announcements with rich text, images, and read-receipt tracking. Target all or specific blocks/floors.",
    accent: "from-amber-500 to-orange-600",
    items: [
      { label: "Posted Today", value: "2", color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Read Rate", value: "94%", color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Pinned Notices", value: "1", color: "text-indigo-600", bg: "bg-indigo-50" },
      { label: "Comments", value: "18", color: "text-slate-600", bg: "bg-slate-50" },
    ],
  },
];

function PhoneMockup({ screen }: { screen: (typeof screens)[0] }) {
  return (
    <div className="relative w-64 h-[520px] bg-slate-900 rounded-[44px] shadow-2xl shadow-slate-400/30 p-3 mx-auto">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-b-2xl z-10" />
      <div className={`w-full h-full bg-gradient-to-br from-slate-50 to-white rounded-[36px] overflow-hidden`}>
        {/* App Bar */}
        <div className={`bg-gradient-to-r ${screen.accent} px-5 pt-9 pb-5`}>
          <p className="text-white/70 text-xs mb-0.5">{screen.emoji} HomeShare</p>
          <p className="text-white font-bold text-base leading-tight">{screen.title}</p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-2 gap-2 p-4">
          {screen.items.map((item) => (
            <div key={item.label} className={`${item.bg} rounded-2xl p-3`}>
              <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
              <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Activity list */}
        <div className="px-4 space-y-2">
          {["Recent activity", "Tap to view details"].map((t, i) => (
            <div key={i} className={`h-${i === 0 ? 3 : 2} rounded-full bg-slate-100 w-${i === 0 ? "3/4" : "1/2"}`} />
          ))}
          <div className="space-y-2 pt-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-slate-100 shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="h-2 rounded bg-slate-100 w-3/4" />
                  <div className="h-1.5 rounded bg-slate-50 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="absolute bottom-3 left-3 right-3 bg-white rounded-xl shadow-md flex justify-around py-2.5">
          {["🏠", "📋", "💬", "👤"].map((icon, i) => (
            <div key={i} className={`text-base ${i === 0 ? "opacity-100" : "opacity-30"}`}>
              {icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AppScreenshots() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-100 rounded-full uppercase tracking-wider mb-4">
            The app
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-5">
            Beautiful on every screen.{" "}
            <span className="gradient-text">Powerful under the hood.</span>
          </h2>
          <p className="text-lg text-slate-500">
            Available on iOS, Android, and web. Your society, right in your pocket.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Tabs + Copy */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Tab Buttons */}
            <div className="flex flex-wrap gap-2 mb-8">
              {screens.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active === i
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <span>{s.emoji}</span>
                  {s.label}
                </button>
              ))}
            </div>

            {/* Copy */}
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {screens[active].title}
                </h3>
                <p className="text-base text-slate-500 leading-relaxed mb-6">
                  {screens[active].description}
                </p>
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 group"
                >
                  See all features
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </AnimatePresence>

            {/* App store badges */}
            <div className="flex gap-4 mt-10">
              {["App Store", "Google Play"].map((store) => (
                <div
                  key={store}
                  className="flex items-center gap-2 px-4 py-3 bg-slate-900 rounded-2xl hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <span className="text-lg">{store === "App Store" ? "🍎" : "🤖"}</span>
                  <div>
                    <p className="text-[9px] text-slate-400 leading-none">Download on the</p>
                    <p className="text-xs font-semibold text-white">{store}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            {/* Glow */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${screens[active].accent} opacity-20 blur-3xl rounded-full`}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                <PhoneMockup screen={screens[active]} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
