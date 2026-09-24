"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getSiteContent, hydrateSiteContent, type HomeCollectionCard } from "@/lib/site-content";

export default function HomeCollectionCards() {
  const [cards, setCards] = useState<HomeCollectionCard[]>([]);

  useEffect(() => {
    const sync = () => setCards(getSiteContent().homeCollectionCards ?? []);
    sync();
    void hydrateSiteContent().then((content) => setCards(content.homeCollectionCards ?? []));
    window.addEventListener("storage", sync);
    window.addEventListener("drishyam:content-update", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("drishyam:content-update", sync);
    };
  }, []);

  if (cards.length === 0) return null;

  return (
    <section className="bg-[#f7f4ee] px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
          <div>
            <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-[#a9752d]">
              Find your fit
            </span>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#211f1b] sm:text-4xl">
              Shop by collection
            </h2>
          </div>
          <span className="hidden text-xs uppercase tracking-[0.16em] text-[#211f1b]/45 sm:block">
            Seven ways to see yourself
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-7">
          {cards.map((card) => (
            <Link
              key={card.id}
              href={card.href || "/shop"}
              className="group relative aspect-[0.78] overflow-hidden rounded-[22px] bg-[#d9d2c7] shadow-[0_12px_30px_rgba(35,31,26,0.08)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(35,31,26,0.16)] sm:aspect-[0.72]"
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                unoptimized
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 14vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-5">
                <div className="mb-2 h-px w-6 bg-[#f4c46d] transition-all duration-300 group-hover:w-10" />
                <h3 className="text-base font-semibold uppercase tracking-[0.04em] sm:text-lg">{card.title}</h3>
                <span className="mt-2 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/75">
                  Explore <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}