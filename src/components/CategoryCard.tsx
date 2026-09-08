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

    return (
      routeMap[categoryName.toLowerCase()] ||
      `/shop?category=${encodeURIComponent(categoryName)}`
    );
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

  const shouldUseAnySlider =
    shouldUseSlider || shouldUseSmallScreenSlider;

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
  }, [
    emblaApi,
    shouldUseAnySlider,
    updateButtons,
  ]);

  if (!isHydrated || categories.length === 0) {
    return null;
  }

  const handleCategoryClick = (
    category: AdminCategory,
    index: number
  ) => {
    setActive(category.id);

    if (shouldUseAnySlider && emblaApi) {
      emblaApi.scrollTo(index);
    }

    router.push(getCategoryRoute(category.name));
  };

  return (
    <section className="w-full bg-[#f7f7f5] py-3">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">

        {/* Desktop Slider Controls */}
        {shouldUseSlider && (
          <div className="mb-2 flex items-center justify-end">
            <div className="hidden items-center gap-2 sm:flex">

              <button
                type="button"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-300 ${
                  canScrollPrev
                    ? "hover:-translate-x-0.5 hover:bg-gray-950 hover:text-white hover:shadow-md"
                    : "cursor-not-allowed opacity-40"
                }`}
                aria-label="Previous category"
              >
                <ChevronLeft
                  size={17}
                  strokeWidth={1.8}
                />
              </button>

              <button
                type="button"
                onClick={scrollNext}
                disabled={!canScrollNext}
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-300 ${
                  canScrollNext
                    ? "hover:translate-x-0.5 hover:bg-gray-950 hover:text-white hover:shadow-md"
                    : "cursor-not-allowed opacity-40"
                }`}
                aria-label="Next category"
              >
                <ChevronRight
                  size={17}
                  strokeWidth={1.8}
                />
              </button>

            </div>
          </div>
        )}

        {/* Category Slider */}
        {shouldUseAnySlider && (
          <div
            ref={emblaRef}
            className={`${
              shouldUseSlider ? "" : "lg:hidden"
            } overflow-hidden px-1 py-1 touch-pan-y`}
          >
            <div className="flex gap-3 sm:gap-4">

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
                      onClick={() =>
                        handleCategoryClick(
                          category,
                          index
                        )
                      }
                    />
                  </div>
                );
              })}

            </div>
          </div>
        )}

        {/* Desktop Grid */}
        {!shouldUseSlider && (
          <div
            className={`gap-3 sm:gap-4 ${
              shouldUseSmallScreenSlider
                ? "hidden lg:grid"
                : "grid"
            } lg:grid-cols-6`}
          >

            {categories.map((category, index) => {
              const isActive = active === category.id;

              return (
                <div
                  key={category.id}
                  className="min-w-0"
                >
                  <CategoryCard
                    category={category}
                    isActive={isActive}
                    onClick={() =>
                      handleCategoryClick(
                        category,
                        index
                      )
                    }
                  />
                </div>
              );
            })}

          </div>
        )}

        {/* Mobile Slider Controls */}
        {shouldUseAnySlider && (
          <div className="mt-3 flex items-center justify-between lg:hidden">

            <span className="text-[11px] font-medium tracking-wide text-gray-400">
              Swipe to explore
            </span>

            <div className="flex gap-1.5">

              <button
                type="button"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className={`flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-200 ${
                  !canScrollPrev
                    ? "cursor-not-allowed opacity-40"
                    : "active:scale-90"
                }`}
                aria-label="Previous category"
              >
                <ChevronLeft size={15} />
              </button>

              <button
                type="button"
                onClick={scrollNext}
                disabled={!canScrollNext}
                className={`flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-200 ${
                  !canScrollNext
                    ? "cursor-not-allowed opacity-40"
                    : "active:scale-90"
                }`}
                aria-label="Next category"
              >
                <ChevronRight size={15} />
              </button>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}

interface CategoryCardProps {
  category: AdminCategory;
  isActive: boolean;
  onClick: () => void;
}

function CategoryCard({
  category,
  isActive,
  onClick,
}: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full min-h-[178px] overflow-hidden rounded-[26px] border text-left transition-all duration-500 ${
        isActive
          ? "border-gray-950 shadow-[0_18px_42px_rgba(0,0,0,0.18)] -translate-y-1"
          : "border-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 hover:shadow-[0_20px_42px_rgba(0,0,0,0.15)]"
      }`}
    >

      {/* Premium gradient background */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          isActive
            ? "bg-gradient-to-br from-[#fff8e7] via-[#f4efe5] to-[#e3f7f5]"
            : "bg-gradient-to-br from-white via-[#f8f8f6] to-[#edf5f4] group-hover:from-[#fffaf0] group-hover:to-[#e8f8f6]"
        }`}
      />

      {/* Soft teal glow */}
      <div
        className={`absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#16c7c0]/20 blur-2xl transition-all duration-700 ${
          isActive
            ? "scale-125 opacity-100"
            : "opacity-60 group-hover:scale-125"
        }`}
      />

      {/* Soft yellow glow */}
      <div
        className={`absolute -bottom-16 -left-12 h-36 w-36 rounded-full bg-[#f4b942]/25 blur-2xl transition-all duration-700 ${
          isActive
            ? "scale-125 opacity-100"
            : "opacity-60 group-hover:scale-125"
        }`}
      />

      {/* Decorative corner ring */}
      <div className="absolute -right-8 top-7 h-24 w-24 rounded-full border-[10px] border-white/40 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110" />

      {/* Decorative second ring */}
      <div className="absolute -left-7 bottom-7 h-16 w-16 rounded-full border-[6px] border-[#16c7c0]/10 transition-transform duration-700 group-hover:-rotate-12 group-hover:scale-110" />

      {/* Decorative dots */}
      <div className="absolute right-14 top-14 grid grid-cols-3 gap-1 opacity-40">

        {Array.from({ length: 9 }).map((_, i) => (
          <span
            key={i}
            className="h-1 w-1 rounded-full bg-gray-950 transition-all duration-500 group-hover:scale-125"
          />
        ))}

      </div>

 

      {/* Top right arrow */}
      <div
        className={`absolute right-3.5 top-3.5 z-30 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-500 ${
          isActive
            ? "rotate-45 border-gray-950 bg-gray-950 text-white"
            : "border-white bg-white/90 text-gray-700 shadow-sm group-hover:rotate-45 group-hover:border-gray-950 group-hover:bg-gray-950 group-hover:text-white"
        }`}
      >
        <ArrowUpRight
          size={16}
          strokeWidth={2.2}
        />
      </div>

      {/* Product image */}
      <div className="absolute inset-x-0 top-[28px] z-10 flex h-[94px] items-center justify-center px-5">

        {/* Image glow */}
        <div
          className={`absolute h-[86px] w-[86px] rounded-full bg-white/55 blur-xl transition-all duration-700 ${
            isActive
              ? "scale-125 opacity-100"
              : "opacity-70 group-hover:scale-125"
          }`}
        />

        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className={`relative z-10 h-full max-h-[94px] w-auto max-w-[86%] object-contain drop-shadow-[0_10px_12px_rgba(0,0,0,0.12)] transition-all duration-700 ease-out ${
            isActive
              ? "scale-[1.1] -rotate-1"
              : "group-hover:scale-[1.14] group-hover:rotate-2"
          }`}
        />

      </div>

      {/* Bottom information panel */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 overflow-hidden rounded-[17px] border border-white/80 bg-white/88 px-3.5 py-2.5 shadow-[0_8px_22px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 group-hover:bg-white/95">

        {/* Gradient side accent */}
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#7A4B00] via-[#D4AF37] via-[#FFF4B0] via-[#FFD700] to-[#A66A00]" />

        <div className="flex items-center justify-between gap-2 pl-1">

          <div className="min-w-0">

      

            <h3 className="truncate text-[14px] font-extrabold leading-tight tracking-[-0.025em] text-gray-950">
              {category.name}
            </h3>

          </div>

          {/* Small action button */}
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
              isActive
                ? "bg-[#d6a354] text-gray-950 shadow-[0_4px_12px_rgba(22,199,192,0.35)]"
                : "bg-gray-100 text-gray-600 group-hover:bg-[#d6a354] group-hover:text-gray-950"
            }`}
          >
            <ArrowUpRight
              size={13}
              strokeWidth={2.2}
            />
          </span>

        </div>
      </div>

      {/* Active gradient indicator */}
      <span
     className={`absolute bottom-0 left-0 z-40 h-[4px] rounded-r-full bg-gradient-to-r from-[#8C5A00] via-[#D4AF37] via-[#FFF4B0] via-[#FFD700] to-[#A66A00] transition-all duration-500 ${
          isActive
            ? "w-full"
            : "w-0 group-hover:w-full"
        }`}
      />

    </button>
  );
}