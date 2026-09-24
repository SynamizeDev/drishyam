"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_SITE_CONTENT, getSiteContent, hydrateSiteContent } from "@/lib/site-content";
import { makeWhatsAppUrl } from "@/lib/whatsapp";

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [siteContent, setSiteContent] = useState(DEFAULT_SITE_CONTENT);

  useEffect(() => {
    const sync = () => {
      setSiteContent(getSiteContent());
    };

    if (typeof window !== "undefined") {
      sync();
      void hydrateSiteContent().then(setSiteContent);
      window.addEventListener("storage", sync);
      window.addEventListener("drishyam:content-update", sync);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", sync);
        window.removeEventListener("drishyam:content-update", sync);
      }
    };
  }, []);

  const slides =
    siteContent.hero.slides ?? DEFAULT_SITE_CONTENT.hero.slides;

  useEffect(() => {
    if (!slides.length) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const activeSlide = slides[activeIndex] ?? slides[0];
  const sharedSlideTransition = {
    duration: 1.4,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
  };

  const handleEnquireNow = () => {
    window.open(makeWhatsAppUrl([]), "_blank", "noopener,noreferrer");
  };

  if (!activeSlide) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#211f1b]">
      <div className="group relative h-[400px] w-full overflow-hidden sm:h-[680px] lg:h-[600px]">

        {/* ================= BACKGROUND IMAGE ================= */}
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={`slide-${activeIndex}`}
            initial={{
              opacity: 0,
              scale: 1.04,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 1.02,
            }}
            transition={sharedSlideTransition}
            className="absolute inset-0"
          >
            <Image
              src={activeSlide.image}
              alt={activeSlide.alt}
              fill
              priority
              unoptimized
              className="object-cover opacity-80 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#211f1b]/95 via-[#211f1b]/65 to-[#211f1b]/15" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(193,139,60,0.22),transparent_32%)]" />

        {/* ================= CONTENT ================= */}
        <div className="absolute inset-0 flex  z-10 px-4 sm:px-6 lg:px-8">
          <div className="w-full grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">

            <motion.div
              key={activeSlide.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="text-left"
            >
              <div className="relative   lg:-mt-[100px] ">
                <div className="inline-flex items-center gap-3 border-l-2 border-[#d6a354] bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f5dfb4] backdrop-blur-sm max-sm:text-[8px]">
                <span className="h-2 w-2 rounded-full bg-[#d6a354]" />
                {activeSlide.eyebrow || activeSlide.title}
              </div>

              <h1 className="mt-6 max-sm:text-xl text-4xl font-semibold uppercase leading-[0.98] text-white sm:text-5xl md:text-6xl">
                {siteContent.hero.headline}
              </h1>

              {siteContent.hero.highlight && (
                <div className="mt-3 inline-flex items-center rounded-full border border-[#f59e0b]/40 bg-[#f59e0b]/10 px-3 py-1.5 text-[10px] font-bold uppercase -[0.24em] text-[#fef3c7]">
                  {siteContent.hero.highlight}
                </div>
              )}

              {/* <p className="mt-6 max-sm:mt-2 max-sm:text-xs max-w-xl text-base sm:text-lg text-slate-100 leading-relaxed">
                {activeSlide.subtitle} — {siteContent.hero.description}
              </p> */}

              <div className="mt-8 max-sm:mt-2 flex flex-col sm:flex-row gap-2">
<div className="flex items-center gap-3 max-sm:gap-2 w-full">
  <Link
    href="/shop"
    className="btn-primary inline-flex  items-center whitespace-nowrap justify-center gap-1.5 rounded-lg border border-[#d6a354] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white transition-transform duration-200 hover:scale-[1.02] sm:w-auto sm:gap-2 sm:px-7 sm:py-3.5 sm:text-sm sm:tracking-[0.16em]"
  >
    {activeSlide.primaryLabel || "See All Collections"}
    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
  </Link>

  <button
    type="button"
    onClick={handleEnquireNow}
    className="btn-secondary inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#d6a354] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#211f1b] shadow-[0_18px_35px_rgba(193,139,60,0.35)] transition-transform duration-200 hover:scale-[1.02] sm:w-auto sm:gap-2 sm:px-7 sm:py-3.5 sm:text-sm sm:tracking-[0.16em]"
  >
    {activeSlide.secondaryLabel || "Enquire Now"}
    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
  </button>
</div>
              </div>

              <div className="mt-8 max-sm:mt-3 max-sm:gap-2 flex flex-wrap gap-4 max-sm:text-xs text-sm text-slate-200/90">
                {siteContent.hero.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              </div>
              
            </motion.div>

            {/* ================= RIGHT IMAGE ================= */}
            {/* <div className="hidden lg:flex justify-end">
              <div className="relative w-full max-w-[420px] rounded-[28px] border border-white/10 bg-white/8 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur-md">

                <div className="overflow-hidden rounded-[22px] bg-[#f8fafc]">

                  <div className="relative aspect-[4/5]">

                    <AnimatePresence initial={false} mode="sync">
                      <motion.div
                        key={`right-${activeIndex}`}
                        initial={{
                          opacity: 0,
                          scale: 1.04,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 1.02,
                        }}
                        transition={sharedSlideTransition}
                        className="absolute inset-0"
                      >
                        <Image
                          src={activeSlide.image}
                          alt={activeSlide.alt}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="420px"
                        />
                      </motion.div>
                    </AnimatePresence>

                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-[#111827] px-4 py-3 text-white">
                  <div>
                    <p className="text-[10px] uppercase -[0.24em] text-slate-300">
                      {activeSlide.badge || "Best Seller"}
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      {activeSlide.title}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#f59e0b] px-3 py-1 text-xs font-bold text-[#111827]">
                    Special Offer
                  </span>
                </div>

              </div>
            </div> */}
          </div>
        </div>

        {/* ================= SLIDER DOTS ================= */}
        <div className="absolute max-sm:bottom-5 bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id || slide.title}
              type="button"
              aria-label={`View slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                index === activeIndex
                  ? "w-9 bg-[#f59e0b]"
                  : "bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>

        {/* <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-white to-transparent" /> */}
      </div>
    </section>
  );
}