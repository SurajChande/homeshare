"use client";

import { motion } from "framer-motion";
import { Home } from "lucide-react";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "App Download", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Community", href: "#" },
    { label: "Tutorials", href: "#" },
    { label: "API Docs", href: "#" },
    { label: "System Status", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Refund Policy", href: "#" },
    { label: "Security", href: "#" },
  ],
};

const socials = [
  { icon: XIcon, href: "#", label: "X (Twitter)" },
  { icon: LinkedinIcon, href: "#", label: "LinkedIn" },
  { icon: InstagramIcon, href: "#", label: "Instagram" },
];

const awards = [
  { emoji: "🏆", label: "Product Hunt #1" },
  { emoji: "⭐", label: "4.9/5 on G2" },
  { emoji: "🔒", label: "SOC2 Compliant" },
  { emoji: "🇮🇳", label: "Made in India" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Top CTA Banner */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-extrabold text-white mb-1">
                Start your free trial today
              </h3>
              <p className="text-slate-400 text-sm">
                3 months free. No credit card. Setup in 30 minutes.
              </p>
            </div>
            <div className="flex gap-4">
              <a
                href="/auth/signup"
                className="px-6 py-3 text-sm font-semibold text-indigo-700 bg-white rounded-2xl hover:bg-indigo-50 transition-colors shadow-lg"
              >
                Get Started Free
              </a>
              <a
                href="/dashboard"
                className="px-6 py-3 text-sm font-semibold text-white border border-slate-700 rounded-2xl hover:bg-slate-800 transition-colors"
              >
                Browse Listings
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-10">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Home<span className="text-indigo-400">Share</span>
              </span>
            </a>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
              Your Society. Connected. Organized. Effortless.
              <br />
              The modern platform for housing societies and apartment associations across India.
            </p>

            {/* Awards */}
            <div className="flex flex-wrap gap-2 mb-6">
              {awards.map((a) => (
                <span
                  key={a.label}
                  className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800 px-3 py-1.5 rounded-full"
                >
                  <span>{a.emoji}</span>
                  {a.label}
                </span>
              ))}
            </div>

            {/* Socials */}
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-colors duration-200"
                >
                  <s.icon className="w-4 h-4 text-slate-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="col-span-1">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">
                {section}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} HomeShare Technologies Pvt. Ltd. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with ❤️ in India · Serving 2,400+ societies
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
