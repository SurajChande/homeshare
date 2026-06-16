"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, X, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    tagline: "For small societies",
    monthlyPrice: 0,
    annualPrice: 0,
    badge: null,
    color: "border-slate-200",
    buttonStyle: "bg-slate-900 text-white hover:bg-slate-700",
    features: [
      { text: "Up to 50 flats", included: true },
      { text: "Notice board", included: true },
      { text: "Visitor log (manual)", included: true },
      { text: "Basic complaint tracking", included: true },
      { text: "Maintenance billing", included: false },
      { text: "Online payment collection", included: false },
      { text: "Financial reports", included: false },
      { text: "Priority support", included: false },
    ],
  },
  {
    name: "Society",
    tagline: "Most popular",
    monthlyPrice: 4999,
    annualPrice: 3999,
    badge: "Most Popular",
    color: "border-indigo-500 ring-2 ring-indigo-500 ring-offset-2",
    buttonStyle:
      "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-xl hover:shadow-indigo-200",
    features: [
      { text: "Up to 200 flats", included: true },
      { text: "Notice board + read receipts", included: true },
      { text: "Visitor management + OTP gate", included: true },
      { text: "Full complaint tracking", included: true },
      { text: "Maintenance billing & reminders", included: true },
      { text: "Online payment collection", included: true },
      { text: "Monthly financial reports", included: true },
      { text: "Priority support", included: false },
    ],
  },
  {
    name: "Enterprise",
    tagline: "For large townships",
    monthlyPrice: 12999,
    annualPrice: 9999,
    badge: null,
    color: "border-slate-200",
    buttonStyle: "bg-slate-900 text-white hover:bg-slate-700",
    features: [
      { text: "Unlimited flats", included: true },
      { text: "Notice board + read receipts", included: true },
      { text: "Visitor management + OTP gate", included: true },
      { text: "Full complaint tracking", included: true },
      { text: "Maintenance billing & reminders", included: true },
      { text: "Online payment collection", included: true },
      { text: "Real-time financial reports + export", included: true },
      { text: "Dedicated account manager", included: true },
    ],
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full uppercase tracking-wider mb-4">
            Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-5">
            Simple, transparent{" "}
            <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-lg text-slate-500 mb-8">
            No hidden fees. No per-flat charges. One flat price for your whole society.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-slate-100 rounded-2xl p-1.5">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                !annual ? "bg-white shadow-sm text-slate-900" : "text-slate-500"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                annual ? "bg-white shadow-sm text-slate-900" : "text-slate-500"
              }`}
            >
              Annual
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-3xl border-2 ${plan.color} p-8 bg-white`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold rounded-full shadow-lg">
                    <Zap className="w-3 h-3" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{plan.tagline}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {annual ? plan.annualPrice === 0 : plan.monthlyPrice === 0
                      ? "Free"
                      : `₹${(annual ? plan.annualPrice : plan.monthlyPrice).toLocaleString("en-IN")}`}
                  </span>
                  {(annual ? plan.annualPrice : plan.monthlyPrice) > 0 && (
                    <span className="text-slate-400 text-sm mb-1">/month</span>
                  )}
                </div>
                {annual && (plan.annualPrice > 0) && (
                  <p className="text-xs text-slate-400 mt-1">
                    Billed annually · Save ₹{((plan.monthlyPrice - plan.annualPrice) * 12).toLocaleString("en-IN")}/yr
                  </p>
                )}
              </div>

              {/* CTA */}
              <a
                href="/auth/signup"
                className={`w-full flex items-center justify-center py-3.5 px-6 rounded-2xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 mb-8 ${plan.buttonStyle}`}
              >
                {plan.annualPrice === 0 && plan.monthlyPrice === 0
                  ? "Start Free — No Card Needed"
                  : "Start 3-Month Free Trial"}
              </a>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3">
                    {feature.included ? (
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </span>
                    ) : (
                      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                        <X className="w-3 h-3 text-slate-400" />
                      </span>
                    )}
                    <span
                      className={`text-sm ${
                        feature.included ? "text-slate-700" : "text-slate-400"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-sm text-slate-400 mt-10"
        >
          All plans include a 3-month free trial. No credit card required. Cancel anytime.{" "}
          <a href="#faq" className="text-indigo-500 hover:underline">
            See FAQ
          </a>{" "}
          for more details.
        </motion.p>
      </div>
    </section>
  );
}
