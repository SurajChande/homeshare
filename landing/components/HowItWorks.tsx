"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Users, Sparkles, TrendingUp } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Building2,
    title: "Register your society",
    description:
      "Sign up and add your society's details — name, address, total flats, blocks. Takes under 5 minutes.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    accent: "from-indigo-500 to-violet-600",
  },
  {
    step: "02",
    icon: Users,
    title: "Onboard residents & staff",
    description:
      "Invite residents via SMS or email. Add security guards and committee members with the right roles.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    accent: "from-violet-500 to-indigo-600",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Configure & customise",
    description:
      "Set maintenance amounts, payment cycles, notice categories, and gate rules — your way.",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    accent: "from-cyan-500 to-blue-600",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Go live and grow",
    description:
      "Watch collection rates soar, complaints resolve faster, and residents stay engaged — from day one.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    accent: "from-emerald-500 to-teal-600",
  },
];

function StepCard({
  step,
  index,
  isLast,
}: {
  step: (typeof steps)[0];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div className="relative flex flex-col items-center">
      {/* Connector line */}
      {!isLast && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
          className="hidden lg:block absolute top-10 left-[calc(50%+3rem)] right-[calc(-50%+3rem)] h-px bg-gradient-to-r from-indigo-300 to-violet-300 origin-left"
        />
      )}

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.15 }}
        className="flex flex-col items-center text-center max-w-[220px]"
      >
        {/* Step number + icon */}
        <div className="relative mb-5">
          <div
            className={`w-20 h-20 rounded-3xl ${step.bg} border-2 ${step.border} flex items-center justify-center shadow-lg`}
          >
            <step.icon className={`w-8 h-8 ${step.color}`} />
          </div>
          <div
            className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br ${step.accent} flex items-center justify-center`}
          >
            <span className="text-white text-[9px] font-bold">{step.step}</span>
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
      </motion.div>
    </div>
  );
}

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full uppercase tracking-wider mb-4">
            Simple setup
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-5">
            Up and running in{" "}
            <span className="gradient-text">under 30 minutes</span>
          </h2>
          <p className="text-lg text-slate-500">
            No technical expertise needed. If you can send a WhatsApp message, you can run HomeShare.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-4">
          {steps.map((step, index) => (
            <StepCard
              key={step.step}
              step={step}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        {/* CTA box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 p-10 text-center shadow-2xl shadow-indigo-300/40"
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Ready to transform your society?
            </h3>
            <p className="text-indigo-200 text-base mb-8 max-w-md mx-auto">
              Join 2,400+ societies already running on HomeShare. First 3 months free. No credit card required.
            </p>
            <a
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-indigo-700 bg-white rounded-2xl hover:bg-indigo-50 shadow-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              Start for Free
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
