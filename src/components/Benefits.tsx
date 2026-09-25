"use client";

import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  ClipboardCheck,
  ArrowLeftRight,
  Truck,
  Eye,
  Sparkles,
  Award,
  HeartHandshake,
  Glasses,
  Clock,
  Star,
  CheckCircle2,
} from "lucide-react";
import {
  DEFAULT_SITE_CONTENT,
  getSiteContent,
  hydrateSiteContent,
} from "@/lib/site-content";

const ICON_MAP: Record<string, React.ElementType> = {
  ShieldCheck,
  ClipboardCheck,
  ArrowLeftRight,
  Truck,
  Eye,
  Sparkles,
  Award,
  HeartHandshake,
  Glasses,
  Clock,
  Star,
  CheckCircle2,
};

const BENEFIT_IMAGES = [
  "/assets/Premium-Quality.png",
  "/assets/Prescription-Ready.png",
  "/assets/Easy-Returns.png",
  "/assets/Fast-Delivery.png",
];

export default function Benefits() {
  const [benefits, setBenefits] = useState(DEFAULT_SITE_CONTENT.benefits);

  useEffect(() => {
    const sync = () => {
      const content = getSiteContent();
      setBenefits(content.benefits ?? DEFAULT_SITE_CONTENT.benefits);
    };

    sync();

    void hydrateSiteContent().then((content) => {
      setBenefits(content.benefits ?? DEFAULT_SITE_CONTENT.benefits);
    });

    window.addEventListener("storage", sync);
    window.addEventListener("drishyam:content-update", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("drishyam:content-update", sync);
    };
  }, []);

  if (!benefits || benefits.length === 0) return null;

  return (
    <section className="relative isolate overflow-hidden bg-[#11100e] py-20 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[5%] top-[10%] h-[300px] w-[300px] rounded-full bg-[#f59e0b]/15 blur-[120px]" />
        <div className="absolute right-[5%] top-[30%] h-[350px] w-[350px] rounded-full bg-[#eab308]/10 blur-[140px]" />
        <div className="absolute bottom-[-150px] left-1/2 h-[400px] w-[500px] -translate-x-1/2 rounded-full bg-[#f59e0b]/10 blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

        <div className="absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#f59e0b]/70 to-transparent" />
      </div>

      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-xl">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f59e0b]/15">
              <Sparkles className="h-3 w-3 text-[#fbbf24]" />
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#fbbf24]">
              The Drishyam Experience
            </span>
          </div>

          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            More Than Eyewear.
            <span className="block bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#fde68a] bg-clip-text text-transparent">
              A Better Way to See.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/50 sm:text-base">
            Every detail is designed to give you a premium, comfortable and confident eyewear experience.
          </p>
        </div>

        <div
          className={`grid gap-4 sm:gap-5 lg:gap-6 ${
            benefits.length >= 4
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              : benefits.length === 3
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2"
          }`}
        >
          {benefits.map((item, index) => {
            const IconComponent = ICON_MAP[item.icon] ?? ShieldCheck;
            const imageSrc =
              BENEFIT_IMAGES[index] ?? item.icon ?? BENEFIT_IMAGES[0];
            const isImageIcon =
              typeof imageSrc === "string" &&
              (imageSrc.startsWith("/") ||
                imageSrc.startsWith("http") ||
                imageSrc.includes("."));

            return (
              <div
                key={item.id ?? `${item.title}-${index}`}
                className="group relative min-h-[250px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-[#f59e0b]/40 hover:bg-white/[0.08] hover:shadow-[0_25px_80px_rgba(0,0,0,0.35)]"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.10] via-transparent to-transparent opacity-60" />
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#f59e0b]/0 blur-3xl transition-all duration-500 group-hover:bg-[#f59e0b]/20" />

                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex items-center gap-3 text-[#fbbf24]">
                    <div className="flex  transition-all duration-500 group-hover:border-[#f59e0b]/40 ">
                      {isImageIcon ? (
                        <img
                          src={imageSrc}
                          alt={item.title}
                          className="h-30 w-30 object-contain transition-all duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <IconComponent className="h-5 w-5" />
                      )}
                    </div>
                  </div>

                  <span className="text-sm font-bold tracking-[0.2em] text-white/10 transition-colors duration-500 group-hover:text-[#fbbf24]/50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="relative z-10 mt-10">
                  <h3 className="text-lg font-semibold tracking-tight text-white transition-colors duration-300 group-hover:text-[#fde68a]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-white/50 transition-colors duration-300 group-hover:text-white/65">
                    {item.description}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
                  <div className="h-full w-0 bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-transparent transition-all duration-700 group-hover:w-full" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#f59e0b]/60" />

          <Glasses className="h-5 w-5 text-[#f59e0b]/70" />

          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#f59e0b]/60" />
        </div>
      </div>
    </section>
  );
}