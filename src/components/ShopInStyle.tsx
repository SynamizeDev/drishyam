"use client";

import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

const ShopInStyle = () => {
  return (
    <section className="relative lg:-mt-[30px] w-full overflow-hidden rounded-tl-[36px] rounded-tr-[36px] bg-white px-4 py-14 sm:px-6 lg:px-8">
      {/* Soft decorative background */}
      <div className="pointer-events-none absolute -right-32 top-10 h-72 w-72 rounded-full bg-[#d6a354]/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-[#f3efe8] blur-3xl" />

      {/* Section Header */}
      <div className="relative z-10 mx-auto mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-[1px] w-8 bg-[#c18b3c]" />

            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#a9752d]">
              Curated Eyewear
            </span>

            <Sparkles className="h-3.5 w-3.5 text-[#c18b3c]" />
          </div>

          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#211f1b] sm:text-4xl">
            Shop In Style
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
            Discover our latest collection.
          </p>
        </div>

        <div className="hidden h-px flex-1 bg-gradient-to-r from-[#e8e0d3] to-transparent lg:mb-3 lg:ml-10 lg:block" />
      </div>

      {/* Main Cards */}
      <div className="relative z-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

        {/* TEXT CARD */}
        <div className="group relative min-h-[420px] overflow-hidden rounded-[26px] border border-[#ebe6de] bg-[#f6f6f7] px-8 py-10 shadow-[0_15px_45px_rgba(35,31,26,0.05)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(35,31,26,0.10)] sm:px-9">
          
          {/* Decorative circle */}
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border-[35px] border-[#d6a354]/10 transition-transform duration-700 group-hover:scale-110" />

          <div className="absolute bottom-[-80px] right-[-60px] h-48 w-48 rounded-full bg-[#d6a354]/10 blur-2xl transition-all duration-700 group-hover:bg-[#d6a354]/20" />

          <div className="relative z-10 flex h-full flex-col items-start justify-center">
            <div className="mb-7 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#c18b3c] shadow-[0_0_0_6px_rgba(193,139,60,0.12)]" />

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#211f1b]">
                New Collection
              </p>
            </div>

            <h3 className="mb-8 max-w-[290px] text-4xl font-black uppercase leading-[0.98] tracking-[-0.04em] text-[#211f1b] sm:text-[42px]">
              A Style For Every Story
            </h3>

            <p className="mb-9 max-w-[270px] text-sm leading-6 text-gray-500">
              Discover thoughtfully designed frames made to complement
              your everyday style.
            </p>

            <button
              type="button"
              className="group/button inline-flex items-center justify-center gap-3 rounded-xl bg-[#d6a354] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#211f1b] shadow-[0_15px_30px_rgba(193,139,60,0.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#e0b365] hover:shadow-[0_20px_40px_rgba(193,139,60,0.38)] active:scale-95"
            >
              Shop Now

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
            </button>
          </div>
        </div>

        {/* IMAGE CARD 1 */}
        <div className="group relative min-h-[420px] overflow-hidden rounded-[26px] shadow-[0_15px_45px_rgba(35,31,26,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_65px_rgba(35,31,26,0.16)]">
          
          <Image
            src="https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1000&q=85"
            alt="Stylish optical glasses"
            fill
            unoptimized
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Image overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute inset-0 bg-[#c18b3c]/0 transition-colors duration-500 group-hover:bg-[#c18b3c]/10" />

          {/* Top label */}
          <div className="absolute left-5 top-5">
            <div className="rounded-full border border-white/30 bg-white/15 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white shadow-lg backdrop-blur-md">
              Eyewear
            </div>
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-7 text-white sm:p-8">
            <div className="mb-4 h-[2px] w-8 bg-[#d6a354] transition-all duration-500 group-hover:w-16" />

            <h3 className="text-2xl font-bold uppercase tracking-tight sm:text-3xl">
              Modern Frames
            </h3>

            <p className="mt-2 max-w-[260px] text-sm leading-5 text-white/75">
              Explore timeless optical styles
            </p>

            <div className="mt-5 flex translate-y-3 items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              Explore Collection
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        {/* IMAGE CARD 2 */}
        <div className="group relative min-h-[420px] overflow-hidden rounded-[26px] shadow-[0_15px_45px_rgba(35,31,26,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_65px_rgba(35,31,26,0.16)]">
          
          <Image
            src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=85"
            alt="Premium designer eyeglasses"
            fill
            unoptimized
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Image overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute inset-0 bg-[#c18b3c]/0 transition-colors duration-500 group-hover:bg-[#c18b3c]/10" />

          {/* Top label */}
          <div className="absolute left-5 top-5">
            <div className="rounded-full border border-white/30 bg-white/15 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white shadow-lg backdrop-blur-md">
              Collection
            </div>
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-7 text-white sm:p-8">
            <div className="mb-4 h-[2px] w-8 bg-[#d6a354] transition-all duration-500 group-hover:w-16" />

            <h3 className="text-2xl font-bold uppercase tracking-tight sm:text-3xl">
              Signature Styles
            </h3>

            <p className="mt-2 max-w-[260px] text-sm leading-5 text-white/75">
              Designed for your everyday look
            </p>

            <div className="mt-5 flex translate-y-3 items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              Explore Collection
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopInStyle;