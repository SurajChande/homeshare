"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MessageSquareX, FileWarning, ClockIcon, BanknoteIcon } from "lucide-react";

const problems = [
  {
    icon: MessageSquareX,
    title: "WhatsApp chaos",
    description:
      "Important notices get buried in 300-member group chats. Nobody knows who read what.",
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-100",
  },
  {
    icon: FileWarning,
    title: "Paper-based records",
    description:
      "Maintenance ledgers, visitor logs, and complaint registers in physical files — lost, misplaced, or never updated.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    icon: ClockIcon,
    title: "Manual follow-ups",
    description:
      "Committee members spend hours chasing residents for dues, collecting complaints, and sending reminders one by one.",
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-100",
  },
  {
    icon: BanknoteIcon,
    title: "No financial visibility",
    description:
      "Treasurers struggle to track inflows, outflows, and generate transparent reports for residents.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
];

function ProblemCard({
  problem,
  index,
}: {
  problem: (typeof problems)[0];
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative group p-6 rounded-3xl border ${problem.border} ${problem.bg} hover:shadow-lg transition-all duration-300`}
    >
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm mb-4`}>
        <problem.icon className={`w-6 h-6 ${problem.color}`} />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">{problem.title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{problem.description}</p>
    </motion.div>
  );
}

export default function ProblemStatement() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-100 rounded-full uppercase tracking-wider mb-4">
            Sound familiar?
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-5">
            Managing your society shouldn't feel like a{" "}
            <span className="relative">
              <span className="relative z-10 text-rose-500">full-time job.</span>
              <svg
                className="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 8C50 3 100 10 150 6C200 2 250 9 298 5"
                  stroke="#fca5a5"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            Thousands of society committees struggle every day with the same frustrations. 
            We built HomeShare to fix all of them — in one place.
          </p>
        </motion.div>

        {/* Problem Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {problems.map((problem, index) => (
            <ProblemCard key={problem.title} problem={problem} index={index} />
          ))}
        </div>

        {/* Arrow to solution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col items-center mt-16 gap-3"
        >
          <p className="text-sm font-medium text-slate-500">
            There&apos;s a better way
          </p>
          <div className="flex flex-col items-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-0.5 h-3 bg-gradient-to-b from-indigo-400 to-violet-500 rounded-full"
                style={{ opacity: 1 - i * 0.25 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
