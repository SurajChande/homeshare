import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HomeShare — Your Society. Connected. Organized. Effortless.",
  description:
    "HomeShare brings your housing society together. Manage notices, collect maintenance, coordinate visitors, and connect neighbours — all in one beautiful app.",
  keywords: ["housing society", "apartment management", "gated community", "society app", "maintenance collection"],
  openGraph: {
    title: "HomeShare — Your Society. Connected. Organized. Effortless.",
    description: "The modern platform for housing societies and apartment associations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-white text-slate-900">{children}</body>
    </html>
  );
}
