"use client";

import React, { useEffect, useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DEFAULT_SITE_CONTENT,
  getSiteContent,
  hydrateSiteContent,
  saveSiteContent,
  TestimonialItem,
  getReviewStatus,
} from "@/lib/site-content";

export default function Testimonials() {
  const [list, setList] = useState<TestimonialItem[]>(
    DEFAULT_SITE_CONTENT.testimonials
  );
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const [reviewForm, setReviewForm] = useState({ name: "", role: "", rating: 5, text: "" });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const hasSubmittedReview = useRef(false);

  useEffect(() => {
    const sync = () => {
      const content = getSiteContent();
      const nextList = (content.testimonials ?? DEFAULT_SITE_CONTENT.testimonials)
        .filter((review) => getReviewStatus(review) === "approved");

      setList(nextList);
      setActiveIdx((prev) =>
        prev >= nextList.length ? 0 : prev
      );
    };

    sync();

    void hydrateSiteContent().then((content) => {
      if (hasSubmittedReview.current) return;
      const nextList = (content.testimonials ?? DEFAULT_SITE_CONTENT.testimonials)
        .filter((review) => getReviewStatus(review) === "approved");

      setList(nextList);
      setActiveIdx((prev) =>
        prev >= nextList.length ? 0 : prev
      );
    });

    window.addEventListener("storage", sync);
    window.addEventListener(
      "drishyam:content-update",
      sync
    );

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(
        "drishyam:content-update",
        sync
      );
    };
  }, []);

  // Auto Play
  useEffect(() => {
    if (!list || list.length <= 1 || isPaused) return;

    const interval = window.setInterval(() => {
      setDirection(1);
      setActiveIdx((prev) => (prev === list.length - 1 ? 0 : prev + 1));
    }, 4500);

    return () => window.clearInterval(interval);
  }, [isPaused, list]);

  if (!list || list.length === 0) return null;

  const currentItem = list[activeIdx] ?? list[0];

  const prev = () => {
    setDirection(-1);
    setActiveIdx((current) =>
      current === 0 ? list.length - 1 : current - 1
    );
  };

  const next = () => {
    setDirection(1);
    setActiveIdx((current) =>
      current === list.length - 1 ? 0 : current + 1
    );
  };

  const submitReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = reviewForm.name.trim();
    const text = reviewForm.text.trim();

    if (!name || text.length < 10) {
      setReviewError("Please add your name and a message of at least 10 characters.");
      return;
    }

    const newReview: TestimonialItem = {
      id: `review-${Date.now()}`,
      name,
      role: reviewForm.role.trim() || "Drishyam Optical customer",
      rating: Math.max(1, Math.min(5, Math.round(Number(reviewForm.rating) || 5))),
      text,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
      status: "pending",
    };

    const content = getSiteContent();
    const nextTestimonials = [...(content.testimonials ?? []), newReview];

    try {
      hasSubmittedReview.current = true;
      await saveSiteContent({ ...content, testimonials: nextTestimonials });
      const approvedTestimonials = nextTestimonials.filter((review) => getReviewStatus(review) === "approved");
      setList(approvedTestimonials);
      setActiveIdx(Math.max(0, approvedTestimonials.length - 1));
      setReviewForm({ name: "", role: "", rating: 5, text: "" });
      setReviewError("");
      setReviewSubmitted(true);
    } catch {
      hasSubmittedReview.current = false;
      setReviewError("We could not send your review right now. Please try again.");
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#f6f1ea] py-20 sm:py-24 lg:py-32">
      {/* Editorial background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-[30%] bg-[#e8ded1]/40" />

        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-[#f59e0b]/15" />
        <div className="absolute -right-20 -top-20 h-[380px] w-[380px] rounded-full border border-[#f59e0b]/10" />

        <div className="absolute bottom-10 left-[8%] text-[280px] font-serif leading-none text-[#f59e0b]/[0.035]">
          ”
        </div>
      </div>

      <div className="relative  px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div className="max-w-xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-[#f59e0b]" />

              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#b87500]">
                Client Stories
              </span>
            </div>

            <h2 className="text-4xl font-medium leading-[1.05] tracking-tight text-charcoal sm:text-5xl lg:text-6xl">
              Loved by those
              <span className="block italic text-[#c68108]">
                who see the difference.
              </span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-charcoal/55 md:text-right">
            Real experiences from people who chose timeless
            craftsmanship, exceptional comfort, and a better
            way to see.
          </p>
        </div>

        {/* Main Testimonial Layout */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
              setIsPaused(false);
            }
          }}
        >
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            <motion.div
              key={currentItem.id || activeIdx}
              custom={direction}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: (direction: number) => ({ opacity: 0, x: direction * 24 }),
                visible: { opacity: 1, x: 0 },
                exit: (direction: number) => ({ opacity: 0, x: direction * -24 }),
              }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="grid overflow-hidden rounded-[32px] bg-white shadow-[0_25px_80px_rgba(70,50,25,0.10)] lg:grid-cols-[0.9fr_1.5fr]"
            >
              {/* LEFT - Dynamic Customer Image */}
              <div className="relative min-h-[280px] overflow-hidden sm:min-h-[360px] lg:min-h-[500px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    currentItem.image ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=900&auto=format&fit=crop"
                  }
                  alt={currentItem.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700"
                />

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Large quote */}
                <div className="absolute left-7 top-7 flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[#d58a00] shadow-xl backdrop-blur-sm">
                  <Quote className="h-6 w-6 fill-current" />
                </div>

                {/* Customer name overlay */}
                <div className="absolute bottom-7 left-7 right-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#fbbf24]" />
                    Verified Experience
                  </div>
                </div>
              </div>

              {/* RIGHT - Review Content */}
              <div className="relative flex min-h-[440px] flex-col justify-between p-7 sm:min-h-[500px] sm:p-10 lg:p-14">
                {/* Decorative quote */}
                <Quote className="absolute right-8 top-8 h-24 w-24 text-[#f59e0b]/[0.06] sm:right-12 sm:top-10 sm:h-32 sm:w-32" />

                <div className="relative">
                  {/* Rating */}
                  <div className="mb-8 flex items-center gap-3">
                    <div className="flex gap-1" aria-label={`${currentItem.rating || 5} out of 5 stars`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.max(1, Math.min(5, Math.round(Number(currentItem.rating) || 5))) ? "fill-[#f59e0b] text-[#f59e0b]" : "text-charcoal/15"}`}
                        />
                      ))}
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-charcoal/35">
                      Customer Review
                    </span>
                  </div>

                  {/* Review */}
                  <blockquote className="max-w-2xl text-2xl font-medium leading-relaxed tracking-tight text-charcoal sm:text-3xl lg:text-4xl">
                    &ldquo;{currentItem.text}&rdquo;
                  </blockquote>
                </div>

                {/* Bottom area */}
                <div className="relative mt-10 border-t border-beige-100 pt-7">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    {/* Customer */}
                    <div>
                      <h4 className="text-base font-bold text-charcoal">
                        {currentItem.name}
                      </h4>

                      <p className="mt-1 text-sm text-[#b87500]">
                        {currentItem.role}
                      </p>
                    </div>

                    {/* Arrows */}
                    {list.length > 1 && (
                      <div className="flex gap-2">
                        <button
                          onClick={prev}
                          className="group flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-charcoal/10 text-charcoal transition-all duration-300 hover:border-[#f59e0b] hover:bg-[#f59e0b] hover:text-white"
                          aria-label="Previous review"
                        >
                          <ChevronLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                        </button>

                        <button
                          onClick={next}
                          className="group flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-charcoal/10 text-charcoal transition-all duration-300 hover:border-[#f59e0b] hover:bg-[#f59e0b] hover:text-white"
                          aria-label="Next review"
                        >
                          <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Dynamic Progress / Indicators */}
                  {list.length > 1 && (
                    <div className="mt-8 flex items-center gap-3">
                      <div className="flex flex-1 gap-2">
                        {list.map((item, idx) => (
                          <button
                            key={item.id}
                            onClick={() => setActiveIdx(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                            className="group relative h-[3px] flex-1 overflow-hidden bg-charcoal/10"
                          >
                            <span
                              className={`absolute inset-y-0 left-0 bg-[#f59e0b] transition-all duration-500 ${
                                idx === activeIdx
                                  ? "w-full"
                                  : "w-0 group-hover:w-1/2"
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      <span className="text-[11px] font-bold tracking-[0.15em] text-charcoal/40">
                        {String(activeIdx + 1).padStart(2, "0")} /{" "}
                        {String(list.length).padStart(2, "0")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Floating trust badge */}
          <div className="absolute -bottom-5 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 rounded-full border border-[#e7d7c0] bg-[#fffaf3] px-6 py-3 shadow-[0_12px_35px_rgba(70,50,25,0.12)] md:flex">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-3.5 w-3.5 fill-[#f59e0b] text-[#f59e0b]"
                />
              ))}
            </div>

            <span className="h-4 w-px bg-charcoal/10" />

            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-charcoal/60">
              Trusted Customer Experiences
            </span>
          </div>
        </div>

        <div className="mt-12 rounded-[28px] border border-[#eadcc6] bg-white p-6 shadow-[0_18px_50px_rgba(70,50,25,0.07)] sm:p-8">
          {reviewSubmitted ? (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <div className="mb-3 flex gap-1 text-[#f59e0b]">
                {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-5 w-5 fill-current" />)}
              </div>
              <h3 className="text-2xl font-semibold text-charcoal">Thank you for sharing.</h3>
              <p className="mt-2 text-sm text-charcoal/55">Your review was sent for approval and will appear after our team reviews it.</p>
              <button type="button" onClick={() => setReviewSubmitted(false)} className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#b87500] hover:text-charcoal">
                Add another review
              </button>
            </div>
          ) : (
            <form onSubmit={submitReview} className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.24em] text-[#b87500]">Your experience</span>
                <h3 className="text-2xl font-semibold text-charcoal sm:text-3xl">Tell us what you think.</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-charcoal/55">Your honest review helps others choose eyewear with confidence.</p>
                <div className="mt-5 flex items-center gap-1" aria-label="Choose a rating">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const rating = index + 1;
                    return (
                      <button key={rating} type="button" onClick={() => setReviewForm((current) => ({ ...current, rating }))} aria-label={`${rating} star${rating === 1 ? "" : "s"}`} className="rounded-md p-1 transition-transform hover:scale-110">
                        <Star className={`h-6 w-6 ${rating <= reviewForm.rating ? "fill-[#f59e0b] text-[#f59e0b]" : "text-charcoal/20"}`} />
                      </button>
                    );
                  })}
                  <span className="ml-2 text-xs font-semibold text-charcoal/45">{reviewForm.rating}/5</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input value={reviewForm.name} onChange={(event) => setReviewForm((current) => ({ ...current, name: event.target.value }))} placeholder="Your name" aria-label="Your name" className="w-full rounded-2xl border border-[#eadcc6] bg-[#fffaf5] px-4 py-3 text-sm text-charcoal outline-none focus:border-[#f59e0b]" />
                  <input value={reviewForm.role} onChange={(event) => setReviewForm((current) => ({ ...current, role: event.target.value }))} placeholder="City or profession (optional)" aria-label="City or profession" className="w-full rounded-2xl border border-[#eadcc6] bg-[#fffaf5] px-4 py-3 text-sm text-charcoal outline-none focus:border-[#f59e0b]" />
                </div>
                <textarea value={reviewForm.text} onChange={(event) => setReviewForm((current) => ({ ...current, text: event.target.value }))} placeholder="Share your experience with us..." aria-label="Your review" rows={4} className="w-full resize-none rounded-2xl border border-[#eadcc6] bg-[#fffaf5] px-4 py-3 text-sm leading-6 text-charcoal outline-none focus:border-[#f59e0b]" />
                {reviewError && <p className="text-xs text-red-600">{reviewError}</p>}
                <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-[#c18b3c]">
                  Submit review
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}