"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import FaceShapeFinder from "@/components/FaceShapeFinder";
import VirtualTryOn from "@/components/VirtualTryOn";
import Benefits from "@/components/Benefits";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

import SearchModal from "@/components/SearchModal";
import MobileMenu from "@/components/MobileMenu";
import CartDrawer from "@/components/CartDrawer";

import { DEFAULT_SITE_CONTENT, getSiteContent, hydrateSiteContent } from "@/lib/site-content";
import { getStoredProducts, hydrateProducts, products as initialProducts } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import type { Product } from "@/types/product";
import OpticalCategories from "@/components/CategoryCard";
import ShopInStyle from "@/components/ShopInStyle";
import HomeCollectionCards from "@/components/HomeCollectionCards";

export default function HomePage() {
  const [visibleNewArrivalsCount, setVisibleNewArrivalsCount] = useState(4);
  const [siteContent, setSiteContent] = useState(DEFAULT_SITE_CONTENT);
  const [productList, setProductList] = useState<Product[]>(initialProducts);

  useEffect(() => {
    const sync = () => {
      setSiteContent(getSiteContent());
      setProductList(getStoredProducts());
    };
    void Promise.all([hydrateSiteContent(), hydrateProducts()]).then(([remoteContent, remoteProducts]) => {
      setSiteContent(remoteContent);
      setProductList(remoteProducts);
    });
    window.addEventListener("storage", sync);
    window.addEventListener("drishyam:content-update", sync);
    window.addEventListener("drishyam:products-update", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("drishyam:content-update", sync);
      window.removeEventListener("drishyam:products-update", sync);
    };
  }, []);

  const featuredProductIds = siteContent.featuredProductIds ?? [];
  const newArrivalProductIds = siteContent.newArrivalProductIds ?? [];
  const shopByStyleProductIds = siteContent.shopByStyleProductIds ?? [];

  const bestSellers = featuredProductIds.length
    ? productList.filter((product) => featuredProductIds.includes(product.id))
    : productList.filter((product) => product.isBestSeller).slice(0, 4);

  const allNewArrivals = newArrivalProductIds.length
    ? productList.filter((product) => newArrivalProductIds.includes(product.id))
    : productList.filter((product) => product.isNew);

  const shopByStyleProducts = shopByStyleProductIds.length
    ? productList.filter((product) => shopByStyleProductIds.includes(product.id))
    : productList.slice(0, 4);

  const visibleNewArrivals = allNewArrivals.slice(0, visibleNewArrivalsCount);

  return (
    <>
      <Header />

      <main className="flex-1">
        <OpticalCategories />
        <Hero />
        <ShopInStyle />
        <HomeCollectionCards />

        <section className="border-t border-beige-100 bg-white py-16 sm:py-20">
          <div className="px-6 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between gap-4 sm:mb-12">
              <div>
              <span className="text-sm font-semibold uppercase -widest text-charcoal/60 block mb-2">
                {siteContent.labels.favorites}
              </span>
              <h2 className="text-3xl font-medium uppercase text-charcoal sm:text-4xl">
                Best Sellers.
              </h2>
              </div>
              <Link href="/shop?best=true" className="hidden border-b border-[#c18b3c] pb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#6e5735] sm:block">
                Shop best sellers
              </Link>
            </div>

            <ProductGrid productsList={bestSellers} />
          </div>
        </section>

<section className="relative overflow-hidden bg-[#211f1b] py-16 text-white sm:py-20">
  {/* Ambient background */}
  <div className="pointer-events-none absolute -left-32 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#d6a354]/10 blur-3xl" />
  <div className="pointer-events-none absolute -right-32 -top-20 h-80 w-80 rounded-full bg-[#fcd34d]/5 blur-3xl" />

  <div className="relative mx-auto px-6 sm:px-8 lg:px-12">
    <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center">
      
      {/* Left Content */}
      <div className="max-w-xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-10 bg-[#d6a354]" />

          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#fcd34d]">
            {siteContent.labels.whyDrishyam}
          </span>
        </div>

        <h2 className="text-4xl font-medium leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
          Premium eyewear,
          <span className="block text-[#d6a354]">
            local expertise,
          </span>
          and real care.
        </h2>

    

        {/* Decorative line */}
        <div className="mt-8 flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-[#fcd34d]" />
          <span className="h-px w-16 bg-white/20" />
          <span className="h-1 w-1 rounded-full bg-[#d6a354]" />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        {siteContent.metrics.map(({ value, label }, index) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#d6a354]/50 hover:bg-white/[0.08]"
            style={{
              animation: `fadeUp 0.7s ease-out ${index * 120}ms both`,
            }}
          >
            {/* Hover glow */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#fcd34d]/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Number */}
            <div className="relative">
              <p className="text-4xl font-semibold tracking-tight text-[#fcd34d] transition-transform duration-500 group-hover:scale-105">
                {value}
              </p>

              <div className="mt-5 h-px w-8 bg-[#d6a354] transition-all duration-500 group-hover:w-14" />

              <p className="mt-4 text-sm leading-6 text-white/60 transition-colors duration-300 group-hover:text-white/85">
                {label}
              </p>
            </div>

            {/* Corner decoration */}
            <div className="absolute bottom-0 right-0 h-12 w-12 rounded-tl-full border-l border-t border-[#d6a354]/10 transition-all duration-500 group-hover:h-16 group-hover:w-16 group-hover:border-[#d6a354]/25" />
          </div>
        ))}
      </div>
    </div>
  </div>

  <style jsx>{`
    @keyframes fadeUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}</style>
</section>
<section className="relative overflow-hidden bg-gradient-to-b from-[#fffaf5] via-white to-[#faf8f4] py-16 sm:py-20 lg:py-24">
  {/* Decorative background elements */}
  <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#d6a354]/10 blur-3xl" />
  <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#eadcc6]/30 blur-3xl" />

  <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8">

    {/* Section Heading */}
    <div className="mb-10 text-center sm:mb-12">
      <div className="mb-3 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-[#c18b3c]" />

        <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-charcoal/60">
          Visit our optical boutique
        </span>

        <span className="h-px w-8 bg-[#c18b3c]" />
      </div>

      <h2 className="text-3xl font-medium uppercase tracking-[-0.02em] text-charcoal sm:text-4xl">
        {siteContent.store.title}
      </h2>

      <div className="mx-auto mt-4 h-[2px] w-10 bg-[#d6a354]" />
    </div>

    {/* Main Layout */}
    <div className="grid items-stretch gap-6 lg:grid-cols-3">

      {/* Information Card */}
      <div className="group relative flex min-h-[380px] flex-col justify-between overflow-hidden rounded-[26px] border border-[#eadcc6] bg-white p-7 shadow-[0_18px_50px_rgba(17,17,17,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_65px_rgba(17,17,17,0.10)] lg:min-h-[430px] lg:p-8">
     <div className="mb-7 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6efe4]">
              <span className="h-2 w-2 rounded-full bg-[#c18b3c]" />
            </span>

            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/50">
              Drishyam Optical
            </p>
          </div>
        {/* Decorative circle */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border-[40px] border-[#d6a354]/10 transition-transform duration-700 group-hover:scale-110" />
 <div className="space-y-5 text-base text-charcoal/75">
                <div className="flex gap-3 items-start">
                  <MapPin className="mt-1 h-5 w-5 text-[#f59e0b]" />
                  <p className="leading-relaxed text-sm">
                    Shiv Dham Gate, near Prajpat Aata Chakki, Khandwa Road, Limbodi, Indore
                  </p>
                </div>

                <div className="flex gap-3 items-center">
                  <Phone className="h-5 w-5 text-[#f59e0b]" />
                  <a href="tel:+917999965453" className="hover:text-charcoal transition-colors text-sm">
                   {siteContent.store.phone}
                  </a>
                </div>

                <div className="flex gap-3 items-center">
                  <Mail className="h-5 w-5 text-[#f59e0b]" />
                  <a href="mailto:hello@drishyamoptical.com" className="hover:text-charcoal transition-colors text-sm">
                    hello@drishyamoptical.com
                  </a>
                </div>
              </div>
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-[#d6a354]/10 blur-3xl transition-all duration-700 group-hover:bg-[#d6a354]/20" />

    

        {/* Bottom Actions */}
        <div className="relative z-10 mt-8 border-t border-[#eee7dc] pt-5">

         

          <Link
            href="/shop"
            className="group/button inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#111111] px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_12px_25px_rgba(17,17,17,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#c18b3c] hover:shadow-[0_15px_30px_rgba(193,139,60,0.25)]"
          >
            Explore Collection

            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/button:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Images */}
      <div className="lg:col-span-2">

        <div className="grid h-[430px] grid-cols-1  md:grid-cols-2 gap-3 sm:h-[480px] sm:gap-5 lg:h-full lg:min-h-[430px]">

          {/* Image 1 */}
          <div className="group relative overflow-hidden rounded-[26px] border border-[#eadcc6] bg-white shadow-[0_18px_50px_rgba(17,17,17,0.07)]">

            <div className="relative h-full w-full overflow-hidden">
              <Image
                src={siteContent.store.image1}
                alt="Premium eyewear display"
                fill
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 33vw"
              />

              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Top label */}
              <div className="absolute left-4 top-4 sm:left-5 sm:top-5">
                <span className="rounded-full border border-white/30 bg-white/15 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md sm:px-4">
                  Eyewear
                </span>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-5 left-5">
                <div className="h-[2px] w-7 bg-[#d6a354] transition-all duration-500 group-hover:w-14" />
              </div>
            </div>
          </div>

          {/* Image 2 */}
          <div className="group relative overflow-hidden rounded-[26px] border border-[#eadcc6] bg-white shadow-[0_18px_50px_rgba(17,17,17,0.07)]">

            <div className="relative h-full w-full overflow-hidden">
              <Image
                src={siteContent.store.image2}
                alt="Luxury sunglasses collection"
                fill
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 33vw"
              />

              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Top label */}
              <div className="absolute left-4 top-4 sm:left-5 sm:top-5">
                <span className="rounded-full border border-white/30 bg-white/15 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md sm:px-4">
                  Collection
                </span>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-5 left-5">
                <div className="h-[2px] w-7 bg-[#d6a354] transition-all duration-500 group-hover:w-14" />
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</section>

        {/* <section className="bg-gradient-to-b from-[#fffaf5] to-white py-16 sm:py-20">
          <div className="mx-auto  px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <span className="text-[12px] font-bold uppercase -[0.24em] text-charcoal/60 block mb-3">Visit our optical boutique</span>
              <h2 className=" text-3xl md:text-4xl text-charcoal font-medium uppercase">{siteContent.store.title}</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 items-center">
                    <div className="flex min-h-[320px] rounded-lg flex-col justify-between border border-[#eadcc6] bg-white p-6 shadow-[0_12px_28px_rgba(17,17,17,0.04)] lg:h-[390px]">
                <div>
                  <p className="text-[11px] font-bold uppercase -[0.18em] text-charcoal/50 mb-2">Drishyam Optical</p>
                  <h3 className=" text-xl text-charcoal mb-4">{siteContent.store.title}</h3>
                  <p className="text-sm leading-relaxed text-charcoal/70 mb-4">{siteContent.store.location}</p>
                  <p className="text-sm text-charcoal/60 font-light mb-4">{siteContent.store.subtitle}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-charcoal/50"><span className="font-semibold">Call:</span> {siteContent.store.phone}</p>
                  <Link href="/shop" className="btn-primary inline-flex items-center gap-2 rounded-xl bg-[#111111] px-4 py-2 text-[10px] font-bold uppercase -[0.18em] text-white hover:bg-[#1d1d1d] transition-colors">
                    Explore collection
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="grid h-[420px] grid-cols-2 gap-3 sm:gap-4 lg:h-[390px]">
                  <div className="relative overflow-hidden border border-[#eadcc6] bg-white shadow-[0_12px_28px_rgba(17,17,17,0.04)] rounded-2xl overflow-hidden">
                    <div className="relative w-full h-full">
                      <Image src={siteContent.store.image1} alt="Premium eyewear display" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                    </div>
                  </div>

                  <div className="relative overflow-hidden border border-[#eadcc6] bg-white shadow-[0_12px_28px_rgba(17,17,17,0.04)] rounded-2xl overflow-hidden">
                    <div className="relative w-full h-full">
                      <Image src={siteContent.store.image2} alt="Luxury sunglasses collection" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                    </div>
                  </div>
                </div>
              </div>

        
            </div>
          </div>
        </section> */}

        <CategoryGrid />

        <section className="bg-[#f3efe8] py-16 sm:py-20">
          <div className="mx-auto  px-6 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <span className="text-sm font-semibold uppercase -[0.24em] text-charcoal/60 block mb-2">
                Shop by style
              </span>
              <h2 className=" text-3xl text-charcoal font-medium uppercase">
                Curated looks for every mood.
              </h2>
            </div>

            <ProductGrid productsList={shopByStyleProducts} />
          </div>
        </section>
           <Benefits />

        <FaceShapeFinder />

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto  px-6 sm:px-6 lg:px-8">
            <div className="mb-16 md:flex justify-between items-end">
              <div>
                <span className="text-sm font-semibold uppercase -widest text-charcoal/60 block mb-2">
                  Just Released
                </span>
                <h2 className=" text-3xl md:text-4xl text-charcoal font-medium uppercase">
                  {siteContent.labels.newArrivals}.
                </h2>
              </div>
            </div>

            <ProductGrid productsList={visibleNewArrivals} />
            {visibleNewArrivalsCount < allNewArrivals.length && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleNewArrivalsCount((prev) => Math.min(prev + 4, allNewArrivals.length))}
                  className="btn-secondary inline-flex items-center justify-center rounded-xl border border-[#111111] bg-white px-6 py-3 text-[11px] font-bold uppercase -[0.24em] text-charcoal transition-all hover:bg-[#111111] hover:text-white"
                >
                  Load more
                </button>
              </div>
            )}
          </div>
        </section>

        <Testimonials />
        <VirtualTryOn />
     
        <Newsletter />
      </main>

      <Footer />

      <SearchModal />
      <MobileMenu />
      <CartDrawer />
    </>
  );
}

