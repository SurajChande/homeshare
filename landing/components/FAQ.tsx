"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How long does it take to set up HomeShare for our society?",
    answer:
      "Most societies are fully set up within 30 minutes. You create the society, add your blocks and flat numbers, invite the committee, and send SMS/email invites to residents. Our onboarding wizard guides every step.",
  },
  {
    question: "Do residents need to download an app?",
    answer:
      "Residents can use both the mobile app (iOS & Android) and the web portal. For residents who prefer not to download an app, the web version works seamlessly on any smartphone browser.",
  },
  {
    question: "How does online maintenance collection work?",
    answer:
      "HomeShare integrates with Razorpay to accept UPI, debit/credit cards, and netbanking. Residents pay directly through the app. Funds are settled to your society's registered bank account within 2 business days.",
  },
  {
    question: "Is our society's data safe and private?",
    answer:
      "Yes. We use AES-256 encryption for data at rest and TLS 1.3 for data in transit. We are SOC2 Type II compliant. Your data is never shared with or sold to any third party. You own your data at all times.",
  },
  {
    question: "Can we migrate our existing Excel/paper records?",
    answer:
      "Absolutely. Our team helps you import flat-wise resident data, historical maintenance records, and outstanding dues via a simple CSV upload. We offer a free assisted migration for all Society and Enterprise plans.",
  },
  {
    question: "What happens after the 3-month free trial?",
    answer:
      "At the end of your trial you can choose a paid plan or continue on the free Starter plan. We send reminders before your trial ends and never charge your card automatically — you always choose to upgrade.",
  },
  {
    question: "Do you support large gated communities with multiple towers?",
    answer:
      "Yes. HomeShare handles multi-tower, multi-block, and multi-phase societies with ease. You can manage everything under one account with separate views per block or tower, or as a unified society.",
  },
  {
    question: "Is there a limit on how many residents or admins we can add?",
    answer:
      "The Starter plan supports up to 50 flats. Society plan supports 200 flats. Enterprise is fully unlimited. You can add as many committee members, sub-admins, and security staff as you need on any plan.",
  },
];

function FAQItem({
  faq,
  index,
}: {
  faq: (typeof faqs)[0];
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: (index % 4) * 0.08 }}
      className="border border-slate-200 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-slate-50 transition-colors duration-200"
      >
        <span className="text-sm sm:text-base font-semibold text-slate-800">
          {faq.question}
        </span>
        <span className="shrink-0 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center transition-colors">
          {open ? (
            <Minus className="w-4 h-4 text-indigo-600" />
          ) : (
            <Plus className="w-4 h-4 text-slate-500" />
          )}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-6 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-4 bg-slate-50">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="faq" className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-semibold text-cyan-600 bg-cyan-50 border border-cyan-100 rounded-full uppercase tracking-wider mb-4">
            FAQ
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-5">
            Questions? We&apos;ve got{" "}
            <span className="gradient-text">answers.</span>
          </h2>
          <p className="text-lg text-slate-500">
            Can&apos;t find what you&apos;re looking for?{" "}
            <a
              href="mailto:hello@homeshare.in"
              className="text-indigo-600 hover:underline font-medium"
            >
              Email us
            </a>{" "}
            and we&apos;ll get back within 2 hours.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="grid gap-3">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
