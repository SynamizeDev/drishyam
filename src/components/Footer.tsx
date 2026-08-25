import React from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  const CURRENT_YEAR = 2026;

  const shopLinks = [
    { name: "All Eyewear", href: "/shop" },
    { name: "Eyeglasses", href: "/shop?category=Eyeglasses" },
    { name: "Sunglasses", href: "/shop?category=Sunglasses" },
    { name: "New Arrivals", href: "/shop?new=true" },
  ];

  const brandLinks = [
    { name: "Our Story", href: "/shop" },
  ];

  const helpLinks = [
    { name: "Prescription Help", href: "/shop" },
    { name: "Shipping & Returns", href: "/shop" },
  ];

  return (
    <footer className="relative isolate overflow-hidden bg-[#11100e] text-white">
      {/* Ambient background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-[#f59e0b]/10 blur-[140px]" />
        <div className="absolute -right-32 bottom-0 h-[450px] w-[450px] rounded-full bg-[#fbbf24]/5 blur-[150px]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Top golden line */}
        <div className="absolute left-1/2 top-0 h-px w-[85%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#f59e0b]/70 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 py-14 md:grid-cols-12 md:gap-12 lg:py-20">
          {/* Brand section */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="space-y-6">
              {/* Glass logo container */}
              <div className="inline-flex rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-xl">
                <BrandLogo
                  variant="full"
                  size="md"
                  theme="dark"
                  href="/"
                />
              </div>

              <p className="max-w-sm text-sm font-light leading-7 text-white/55">
                Handcrafted optical excellence. We create premium
                minimalist eyewear designed around character,
                proportion, and clarity.
              </p>

              {/* Social */}
              <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://www.instagram.com/drishyam_opticals_indore?utm_source=qr&igsh=MTNienYxMDR0a25lbQ%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#f59e0b]/50 hover:bg-[#f59e0b] hover:text-[#11100e] hover:shadow-[0_10px_30px_rgba(245,158,11,0.25)]"
                  aria-label="Instagram"
                >
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      width="20"
                      height="20"
                      x="2"
                      y="2"
                      rx="5"
                      ry="5"
                    />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line
                      x1="17.5"
                      x2="17.51"
                      y1="6.5"
                      y2="6.5"
                    />
                  </svg>
                </a>

                <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/25">
                  Follow Our Journey
                </span>
              </div>
            </div>
          </div>

          {/* Footer links */}
          <div className="md:col-span-7 lg:col-span-8">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10">
              {/* Shop */}
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-px w-5 bg-[#f59e0b]" />
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#fbbf24]">
                    Shop
                  </h4>
                </div>

                <ul className="space-y-3">
                  {shopLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center text-sm font-light text-white/50 transition-colors duration-300 hover:text-white"
                      >
                        <span className="mr-0 h-px w-0 bg-[#f59e0b] transition-all duration-300 group-hover:mr-2 group-hover:w-3" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Brand */}
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-px w-5 bg-[#f59e0b]" />
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#fbbf24]">
                    Brand
                  </h4>
                </div>

                <ul className="space-y-3">
                  {brandLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center text-sm font-light text-white/50 transition-colors duration-300 hover:text-white"
                      >
                        <span className="mr-0 h-px w-0 bg-[#f59e0b] transition-all duration-300 group-hover:mr-2 group-hover:w-3" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div className="col-span-2 sm:col-span-1">
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-px w-5 bg-[#f59e0b]" />
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#fbbf24]">
                    Support
                  </h4>
                </div>

                <ul className="space-y-3">
                  {helpLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center text-sm font-light text-white/50 transition-colors duration-300 hover:text-white"
                      >
                        <span className="mr-0 h-px w-0 bg-[#f59e0b] transition-all duration-300 group-hover:mr-2 group-hover:w-3" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col items-center justify-between gap-5 py-6 sm:flex-row">
          <p className="text-center text-[11px] font-light uppercase tracking-[0.12em] text-white/30 sm:text-left">
            &copy; {CURRENT_YEAR} DRISHYAM OPTICAL. All rights
            reserved.
          </p>

          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/25">
              See Beyond Ordinary
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}