"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Search, ShoppingBag, Heart, User, Menu } from "lucide-react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { motion } from "framer-motion";

export default function Header() {
  const { cartCount, wishlist, setSearchOpen, setCartOpen, setMobileMenuOpen, setOnboardingOpen } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: Array<{ name: string; href: string; highlight?: boolean }> = [
    { name: "Men", href: "/shop?gender=Men" },
    { name: "Women", href: "/shop?gender=Women" },
    { name: "Kids", href: "/shop?gender=Kids" },
    { name: "Eyeglasses", href: "/shop?category=Eyeglasses" },
    { name: "Sunglasses", href: "/shop?category=Sunglasses" },
    { name: "New Arrivals", href: "/shop?new=true" },
    { name: "Best Sellers", href: "/shop?best=true" },
  ];

  return (
    <>
<div className="hidden overflow-hidden border-b border-white/10 bg-[#f2c66d] text-black lg:block">
  <div className="flex h-8 overflow-hidden">
    <motion.div
      className="flex shrink-0 items-center whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.18em]"
      animate={{ x: ["0%", "-50%"] }}
      transition={{
        x: {
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        },
      }}
    >
      {/* First content */}
      <div className="flex shrink-0 items-center gap-10 px-6">
        <span>Curated eyewear for every point of view</span>

        <Link
          className="transition-colors hover:text-white"
          href="/shop?new=true"
        >
          New arrivals
        </Link>

        <Link
          className="transition-colors hover:text-white"
          href="/try-on"
        >
          Virtual try-on
        </Link>

        <Link
          className="transition-colors hover:text-white"
          href="/admin"
        >
          Store login
        </Link>
      </div>

      {/* Duplicate for seamless loop */}
      <div className="flex shrink-0 items-center gap-10 px-6">
        <span>Curated eyewear for every point of view</span>

        <Link
          className="transition-colors hover:text-white"
          href="/shop?new=true"
        >
          New arrivals
        </Link>

        <Link
          className="transition-colors hover:text-white"
          href="/try-on"
        >
          Virtual try-on
        </Link>

        <Link
          className="transition-colors hover:text-white"
          href="/admin"
        >
          Store login
        </Link>
      </div>
    </motion.div>
  </div>
</div>
      <header className={`fixed left-0 right-0 top-0 z-40 w-full border-b border-white/10 bg-[#151513]/95 text-white backdrop-blur-xl transition-all duration-300 ${isScrolled ? "py-2.5 shadow-[0_14px_35px_rgba(0,0,0,0.28)]" : "py-1 lg:py-2"}`}>
        <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={() => setMobileMenuOpen(true)} className="-ml-2 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white lg:hidden" aria-label="Open menu"><Menu className="h-5 w-5" /></button>
              <BrandLogo variant="full" size="md" theme="dark" href="/" />
            </div>
            <nav className="hidden items-center space-x-7 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/65 lg:flex">
              {navItems.map((item) => <Link key={item.name} href={item.href} className="transition-colors hover:text-[#f2c66d]">{item.name}</Link>)}
              <Link href="/admin" className="font-bold text-[#f2c66d] transition-colors hover:text-white">Admin</Link>
            </nav>
            <div className="flex items-center space-x-1 sm:space-x-3">
              <button onClick={() => setSearchOpen(true)} className="rounded-full p-2 text-white/75 transition-colors hover:bg-white/10 hover:text-white" aria-label="Search"><Search className="h-4.5 w-4.5" /></button>
              <button type="button" onClick={() => setOnboardingOpen(true)} className="hidden rounded-full p-2 text-white/75 transition-colors hover:bg-white/10 hover:text-white md:block" aria-label="Open profile onboarding"><User className="h-4.5 w-4.5" /></button>
              <Link href="/shop?wishlist=true" className="relative hidden rounded-full p-2 text-white/75 transition-colors hover:bg-white/10 hover:text-white md:block" aria-label="Wishlist"><Heart className={`h-4.5 w-4.5 ${wishlist.length > 0 ? "fill-red-500 text-red-500" : ""}`} /></Link>
              <button onClick={() => setCartOpen(true)} className="relative rounded-full p-2 text-white/75 transition-colors hover:bg-white/10 hover:text-white" aria-label="Shopping bag"><ShoppingBag className="h-4.5 w-4.5" />{cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#d7a744] text-[10px] font-bold text-[#151513]">{cartCount}</span>}</button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
