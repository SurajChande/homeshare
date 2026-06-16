"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Bell,
  CreditCard,
  UserCheck,
  MessageCircle,
  BarChart3,
  Wrench,
  Vote,
  Shield,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Bell,
    title: "Smart Notices",
    description:
      "Send announcements to all residents or specific flats/blocks. Confirm readership with read receipts.",
    color: "from-amber-400 to-orange-500",
    bg: "bg-amber-50",
    textColor: "text-amber-600",
    size: "col-span-1",
  },
  {
    icon: CreditCard,
    title: "Maintenance Billing",
    description:
      "Auto-generate bills, send reminders, and collect payments via UPI, card, or netbanking. Real-time ledger included.",
    color: "from-emerald-400 to-teal-500",
    bg: "bg-emerald-50",
    textColor: "text-emerald-600",
    size: "col-span-1 sm:col-span-2",
    highlight: true,
  },
  {
    icon: UserCheck,
    title: "Visitor Management",
    description:
      "Residents pre-approve guests. Security verifies via OTP. Full entry/exit logs always available.",
    color: "from-violet-400 to-indigo-500",
    bg: "bg-violet-50",
    textColor: "text-violet-600",
    size: "col-span-1",
  },
  {
    icon: MessageCircle,
    title: "Community Chat",
    description:
      "Structured discussion channels — no chaos. Block-wise, floor-wise, or society-wide conversations.",
    color: "from-cyan-400 to-blue-500",
    bg: "bg-cyan-50",
    textColor: "text-cyan-600",
    size: "col-span-1",
  },
  {
    icon: BarChart3,
    title: "Financial Reports",
    description:
      "Income, expenses, outstanding dues — all in transparent monthly reports. Export to PDF instantly.",
    color: "from-indigo-400 to-violet-600",
    bg: "bg-indigo-50",
    textColor: "text-indigo-600",
    size: "col-span-1 sm:col-span-2",
    highlight: true,
  },
  {
    icon: Wrench,
    title: "Complaint Tracking",
    description:
      "Residents raise issues, track status in real-time. Committees assign and resolve with full audit trail.",
    color: "from-rose-400 to-pink-500",
    bg: "bg-rose-50",
    textColor: "text-rose-600",
    size: "col-span-1",
  },
  {
    icon: Vote,
    title: "Polls & Voting",
    description:
      "Run AGM votes, opinion polls, or community decisions digitally with anonymous or named ballots.",
    color: "from-blue-400 to-cyan-500",
    bg: "bg-blue-50",
    textColor: "text-blue-600",
    size: "col-span-1",
  },
  {
    icon: Shield,
    title: "Role-based Access",
    description:
      "Admin, committee member, security guard, and resident roles — each sees exactly what they need.",
    color: "from-slate-500 to-slate-700",
    bg: "bg-slate-50",
    textColor: "text-slate-600",
    size: "col-span-1",
  },
  {
    icon: Zap,
    title: "Instant Alerts",
    description:
      "Push notifications, SMS, and email — residents never miss an important update.",
    color: "from-yellow-400 to-amber-500",
    bg: "bg-yellow-50",
    textColor: "text-yellow-600",
    size: "col-span-1",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      className={`${feature.size} group relative p-6 rounded-3xl border border-slate-100 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
    >
      {feature.highlight && (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-300`}
        />
      )}
      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${feature.bg} mb-4`}
      >
        <feature.icon className={`w-6 h-6 ${feature.textColor}`} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>

      {feature.highlight && (
        <span className={`absolute top-5 right-5 text-xs font-semibold px-2.5 py-1 rounded-full ${feature.bg} ${feature.textColor} border border-current border-opacity-20`}>
          Popular
        </span>
      )}
    </motion.div>
  );
}

export default function FeaturesGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full uppercase tracking-wider mb-4">
            Everything included
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-5">
            Every tool your society{" "}
            <span className="gradient-text">will ever need</span>
          </h2>
          <p className="text-lg text-slate-500">
            No more juggling 5 apps. HomeShare replaces WhatsApp groups, Excel sheets, 
            cash registers, and complaint notebooks — all in one.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
