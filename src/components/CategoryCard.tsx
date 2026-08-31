"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  AdminCategory,
  getSiteContent,
  hydrateSiteContent,
} from "@/lib/site-content";

export default function OpticalCategories() {
  const router = useRouter();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const getCategoryRoute = (categoryName: string): string => {
    const routeMap: Record<string, string> = {
      eyeglasses: "/eyeglasses",
      sunglasses: "/sunglasses",
      "contact lens": "/contact-lens",
      "contact lense": "/contact-lens",
    };

    return routeMap[categoryName.toLowerCase()] || `/shop?category=${encodeURIComponent(categoryName)}`;
  };

  useEffect(() => {
    const syncCategories = (nextCategories: AdminCategory[]) => {
      setCategories(nextCategories);
      setActive((current) =>
        nextCategories.some((category) => category.id === current)
          ? current
          : nextCategories[0]?.id ?? null
      );
    };

    const sync = () => {
      syncCategories(getSiteContent().categories ?? []);
      setIsHydrated(true);
    };

    sync();
    void hydrateSiteContent().then((content) => {
      syncCategories(content.categories ?? []);
    });

    window.addEventListener("storage", sync);
    window.addEventListener("drishyam:content-update", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("drishyam:content-update", sync);
    };
  }, []);

  const shouldUseSlider = categories.length > 6;
  const shouldUseSmallScreenSlider = categories.length > 1;
  const shouldUseAnySlider = shouldUseSlider || shouldUseSmallScreenSlider;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    loop: false,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateButtons = useCallback(() => {
    if (!emblaApi || !shouldUseAnySlider) {
      setCanScrollPrev(false);
      setCanScrollNext(false);
      return;
    }

    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi, shouldUseAnySlider]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi || !shouldUseAnySlider) return;
    emblaApi.scrollPrev();
  }, [emblaApi, shouldUseAnySlider]);

  const scrollNext = useCallback(() => {
    if (!emblaApi || !shouldUseAnySlider) return;
    emblaApi.scrollNext();
  }, [emblaApi, shouldUseAnySlider]);

  useEffect(() => {
    if (!emblaApi || !shouldUseAnySlider) return;

    const frame = window.requestAnimationFrame(updateButtons);

    emblaApi.on("select", updateButtons);
    emblaApi.on("reInit", updateButtons);

    return () => {
      window.cancelAnimationFrame(frame);
      emblaApi.off("select", updateButtons);
      emblaApi.off("reInit", updateButtons);
    };
  }, [emblaApi, shouldUseAnySlider, updateButtons]);

  if (!isHydrated || categories.length === 0) return null;

  const handleCategoryClick = (category: AdminCategory, index: number) => {
    setActive(category.id);

    if (shouldUseAnySlider && emblaApi) {
      emblaApi.scrollTo(index);
    }

    router.push(getCategoryRoute(category.name));
  };

  return (
    <section className="w-full bg-[#f7f7f5] py-3">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {shouldUseSlider && (
          <div className="mb-2 flex items-center justify-end">
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition-all duration-200 ${
                  canScrollPrev
                    ? "hover:bg-gray-950 hover:text-white"
                    : "cursor-not-allowed opacity-40"
                }`}
                aria-label="Previous category"
              >
                <ChevronLeft size={18} strokeWidth={1.7} />
              </button>

              <button
                type="button"
                onClick={scrollNext}
                disabled={!canScrollNext}
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 transition-all duration-200 ${
                  canScrollNext
                    ? "hover:bg-gray-950 hover:text-white"
                    : "cursor-not-allowed opacity-40"
                }`}
                aria-label="Next category"
              >
                <ChevronRight size={18} strokeWidth={1.7} />
              </button>
            </div>
          </div>
        )}

        {shouldUseAnySlider && (
          <div
            ref={emblaRef}
            className={`${shouldUseSlider ? "" : "lg:hidden"} overflow-hidden px-1 py-1 touch-pan-y`}
          >
            <div className="flex gap-4">
              {categories.map((category, index) => {
                const isActive = active === category.id;

                return (
                  <div
                    key={category.id}
                    className="min-w-0 shrink-0 basis-[52%] sm:basis-[42%] md:basis-[31%] lg:basis-[calc((100%-80px)/6)]"
                  >
                    <CategoryCard
                      category={category}
                      isActive={isActive}
                      onClick={() => handleCategoryClick(category, index)}
                    />
                  </div>
                );
              })}

              <div className="min-w-0 shrink-0 basis-[44%] sm:basis-[42%] md:basis-[31%] lg:basis-[calc((100%-80px)/6)]">
                <LensCard
                  title="Contact Lens"
                  image="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop"
                  href="/contact-lens"
                />
              </div>
            </div>
          </div>
        )}

        {!shouldUseSlider && (
          <div
            className={`gap-4 ${shouldUseSmallScreenSlider ? "hidden lg:grid" : "grid"} lg:grid-cols-6`}
          >
            {categories.map((category, index) => {
              const isActive = active === category.id;

              return (
                <div key={category.id} className="min-w-0">
                  <CategoryCard
                    category={category}
                    isActive={isActive}
                    onClick={() => handleCategoryClick(category, index)}
                  />
                </div>
              );
            })}

            <div>
              <LensCard
                title="Contact Lens"
                image="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop"
                href="/contact-lens"
              />
            </div>
          </div>
        )}

        {shouldUseAnySlider && (
          <div className="mt-4 flex items-center justify-between lg:hidden">
            <span className="text-xs text-gray-400">Swipe to explore</span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white ${
                  !canScrollPrev ? "cursor-not-allowed opacity-40" : ""
                }`}
                aria-label="Previous category"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                type="button"
                onClick={scrollNext}
                disabled={!canScrollNext}
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white ${
                  !canScrollNext ? "cursor-not-allowed opacity-40" : ""
                }`}
                aria-label="Next category"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

interface LensCardProps {
  title: string;
  image: string;
  href: string;
}

function LensCard({ title, image, href }: LensCardProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className="group relative w-full min-h-[210px] overflow-hidden rounded-[24px] text-left transition-all duration-300"
    >
      <div className="absolute inset-0 bg-white transition-all duration-500 group-hover:bg-[#eeede9]" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/60 transition-transform duration-500 group-hover:scale-125" />

      <div className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/20 text-gray-700 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 group-hover:border-gray-950 group-hover:bg-gray-950 group-hover:text-white">
        <ArrowUpRight size={15} />
      </div>

      <div className="absolute inset-x-0 top-9 flex h-[105px] items-center justify-center px-4 sm:h-[115px] lg:h-[110px]">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full max-h-[110px] w-auto max-w-[90%] object-contain transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
        <h3 className="mt-1 text-[15px] font-semibold tracking-tight text-gray-950">{title}</h3>
      </div>

      <span className="absolute bottom-0 left-0 z-30 h-[3px] bg-gray-950 transition-all duration-500 w-0 group-hover:w-full" />
    </button>
  );
}

interface CategoryCardProps {
  category: AdminCategory;
  isActive: boolean;
  onClick: () => void;
}

function CategoryCard({ category, isActive, onClick }: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full min-h-[210px] overflow-hidden rounded-[24px] text-left transition-all duration-300 ${
        isActive ? "ring-2 ring-gray-950 ring-offset-2 ring-offset-[#f7f7f5]" : ""
      }`}
    >
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          isActive ? "bg-[#e9e8e3]" : "bg-white group-hover:bg-[#eeede9]"
        }`}
      />

      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/60 transition-transform duration-500 group-hover:scale-125" />

      <div
        className={`absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/20 text-gray-700 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 ${
          isActive
            ? "border-gray-950 bg-gray-950 text-white"
            : "group-hover:border-gray-950 group-hover:bg-gray-950 group-hover:text-white"
        }`}
      >
        <ArrowUpRight size={15} />
      </div>

      <div className="absolute inset-x-0 top-9 flex h-[105px] items-center justify-center px-4 sm:h-[115px] lg:h-[110px]">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="h-full max-h-[110px] w-auto max-w-[90%] object-contain transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
        <h3 className="mt-1 text-[15px] font-semibold tracking-tight text-gray-950">{category.name}</h3>
      </div>

      <span
        className={`absolute bottom-0 left-0 z-30 h-[3px] bg-gray-950 transition-all duration-500 ${
          isActive ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </button>
  );
}
