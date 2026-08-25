"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Search, ShoppingBag, Heart, User, Menu } from "lucide-react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";

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
      <div className="hidden bg-[#211f1b] px-6 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-white/70 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span>Curated eyewear for every point of view</span>
          <div className="flex items-center gap-5">
            <Link href="/shop?new=true">New arrivals</Link>
            <Link href="/try-on">Virtual try-on</Link>
            <Link href="/admin">Store login</Link>
          </div>
        </div>
      </div>
      <header className={`fixed left-0 right-0 top-0 z-40 w-full border-b border-[#eee9e0] bg-white transition-all duration-300 ${isScrolled ? "py-2.5 shadow-[0_10px_30px_rgba(35,31,26,0.08)]" : "py-1 lg:py-2"}`}>
        <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={() => setMobileMenuOpen(true)} className="-ml-2 rounded-full pr-2 lg:hidden" aria-label="Open menu"><Menu className="h-5 w-5 text-[#231f1a]" /></button>
              <BrandLogo variant="full" size="md" theme="dark" href="/" />
            </div>
            <nav className="hidden items-center space-x-7 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#5f584e] lg:flex">
              {navItems.map((item) => <Link key={item.name} href={item.href} className="transition-colors hover:text-[#a9752d]">{item.name}</Link>)}
              <Link href="/admin" className="font-bold text-[#a9752d]">Admin</Link>
            </nav>
            <div className="flex items-center space-x-1 sm:space-x-3">
              <button onClick={() => setSearchOpen(true)} className="rounded-full p-2 text-[#4c463e] hover:bg-[#f5f1ea]" aria-label="Search"><Search className="h-4.5 w-4.5" /></button>
              <button type="button" onClick={() => setOnboardingOpen(true)} className="hidden rounded-full p-2 text-[#4c463e] hover:bg-[#f5f1ea] md:block" aria-label="Open profile onboarding"><User className="h-4.5 w-4.5" /></button>
              <Link href="/shop?wishlist=true" className="relative hidden rounded-full p-2 text-[#4c463e] hover:bg-[#f5f1ea] md:block" aria-label="Wishlist"><Heart className={`h-4.5 w-4.5 ${wishlist.length > 0 ? "fill-red-500 text-red-500" : ""}`} /></Link>
              <button onClick={() => setCartOpen(true)} className="relative rounded-full p-2 text-[#4c463e] hover:bg-[#f5f1ea]" aria-label="Shopping bag"><ShoppingBag className="h-4.5 w-4.5" />{cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#c18b3c] text-[10px] font-bold text-white">{cartCount}</span>}</button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
