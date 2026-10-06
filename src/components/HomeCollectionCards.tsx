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

  const visibleCards = cards.filter((card) => ["Men", "Women", "Kids"].includes(card.title));

  if (visibleCards.length === 0) return null;

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
            Three ways to see yourself
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
          {visibleCards.map((card) => (
            <Link
              key={card.id}
              href={card.href || "/shop"}
              className="group relative h-[130px] overflow-hidden rounded-[18px] bg-[#d9d2c7] shadow-[0_12px_30px_rgba(35,31,26,0.08)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(35,31,26,0.16)] sm:h-[170px] lg:h-[200px]"
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
              <div className="absolute inset-x-0 bottom-0 p-3 text-white sm:p-4">
                <div className="mb-2 h-px w-5 bg-[#f4c46d] transition-all duration-300 group-hover:w-8" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.04em] sm:text-base">{card.title}</h3>
                <span className="mt-1 inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.16em] text-white/75">
                  Explore <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}