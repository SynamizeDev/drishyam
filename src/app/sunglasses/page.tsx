"use client";

import React, { useState, useEffect, Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import FilterSidebar from "@/components/FilterSidebar";
import SearchModal from "@/components/SearchModal";
import MobileMenu from "@/components/MobileMenu";
import CartDrawer from "@/components/CartDrawer";
import { getStoredProducts, hydrateProducts, defaultProducts as initialProducts } from "@/data/products";
import { getSiteContent, hydrateSiteContent } from "@/lib/site-content";
import { Product } from "@/types/product";
import { SlidersHorizontal, ChevronDown, ArrowLeft, X } from "lucide-react";
import Link from "next/link";

interface Filters {
  category: string;
  gender: string;
  shape: string;
  material: string;
}

const initialFilters: Filters = {
  category: "sunglasses",
  gender: "",
  shape: "",
  material: ""
};

function SunglassesContent() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [allProductsList, setAllProductsList] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [isMobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showLensOptions, setShowLensOptions] = useState(false);
  const [selectedLensColor, setSelectedLensColor] = useState("dark");
  const [prescription, setPrescription] = useState("");
  const [siteContent, setSiteContent] = useState<any>(null);

  const lensColors = ["Clear", "Dark", "UV Protected", "Mirror", "Rose", "Polarized"];

  useEffect(() => {
    const sync = () => {
      setAllProductsList(getStoredProducts());
      setSiteContent(getSiteContent());
    };
    void hydrateProducts().then(setAllProductsList);
    void hydrateSiteContent().then(setSiteContent);
    window.addEventListener("storage", sync);
    window.addEventListener("drishyam:products-update", sync);
    window.addEventListener("drishyam:content-update", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("drishyam:products-update", sync);
      window.removeEventListener("drishyam:content-update", sync);
    };
  }, []);

  useEffect(() => {
    // Separate assigned and other products
    const assignedIds = siteContent?.sunglassesProductIds ?? [];
    const assignedProducts = allProductsList.filter(p => assignedIds.includes(p.id));
    let otherProducts = allProductsList.filter(p => !assignedIds.includes(p.id));

    // Apply filters to other products (but keep assigned products regardless)
    if (filters.category) {
      otherProducts = otherProducts.filter(
        (product) =>
          product.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    if (filters.gender) {
      otherProducts = otherProducts.filter(
        (product) =>
          product.gender?.toLowerCase() === filters.gender.toLowerCase()
      );
    }
    if (filters.shape) {
      otherProducts = otherProducts.filter(
        (product) =>
          product.shape?.toLowerCase() === filters.shape.toLowerCase()
      );
    }
    if (filters.material) {
      otherProducts = otherProducts.filter(
        (product) =>
          product.material?.toLowerCase() === filters.material.toLowerCase()
      );
    }

    // Combine: assigned products first, then other products
    let filtered = [...assignedProducts, ...otherProducts];

    // Apply sorting to all products
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered);
  }, [filters, allProductsList, sortBy, siteContent]);

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <>
      <Header />
      <SearchModal />
      <MobileMenu />
      <CartDrawer />

      <main className="min-h-screen bg-white">
        {/* BREADCRUMB & TITLE */}
        <div className="border-b border-gray-200">
          <div className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8 lg:px-12">
            <Link
              href="/"
              className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-950 transition"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-950">Sunglasses</h1>
            <p className="mt-2 text-gray-600">
              Explore our stylish sunglasses collection with premium lens options and customization
            </p>
          </div>
        </div>

        {/* LENS OPTIONS BANNER */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8 lg:px-12">
            <button
              onClick={() => setShowLensOptions(!showLensOptions)}
              className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white p-4 hover:bg-gray-50 transition"
            >
              <div className="text-left">
                <h3 className="font-semibold text-gray-950">Customize Your Lens</h3>
                <p className="text-sm text-gray-600">Add lens color and prescription options</p>
              </div>
              <ChevronDown
                size={20}
                className={`transition-transform ${showLensOptions ? "rotate-180" : ""}`}
              />
            </button>

            {/* LENS CUSTOMIZATION PANEL */}
            {showLensOptions && (
              <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6 animate-in fade-in">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* LENS COLOR */}
                  <div>
                    <label className="mb-3 block font-semibold text-gray-950">
                      Lens Color/Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {lensColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedLensColor(color.toLowerCase())}
                          className={`
                            rounded-lg border-2 py-2 px-3 text-sm font-medium
                            transition-all duration-200
                            ${
                              selectedLensColor === color.toLowerCase()
                                ? "border-gray-950 bg-gray-950 text-white"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                            }
                          `}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* PRESCRIPTION */}
                  <div>
                    <label className="mb-3 block font-semibold text-gray-950">
                      Prescription (Power)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., -2.0, +1.5"
                      value={prescription}
                      onChange={(e) => setPrescription(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm
                        focus:border-gray-950 focus:outline-none focus:ring-1 focus:ring-gray-950"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Optional: Enter your prescription details
                    </p>
                  </div>
                </div>

                {/* SELECTED OPTIONS SUMMARY */}
                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                  <p className="text-sm font-medium text-gray-950">Selected Options:</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-950 border border-gray-300">
                      Lens: {selectedLensColor.charAt(0).toUpperCase() + selectedLensColor.slice(1)}
                    </span>
                    {prescription && (
                      <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-950 border border-gray-300">
                        Rx: {prescription}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12">
          <div className="flex gap-8">
            {/* FILTERS SIDEBAR - DESKTOP */}
            <div className="hidden w-72 lg:block">
              <FilterSidebar 
                filters={filters} 
                setFilters={setFilters} 
                resetFilters={handleResetFilters}
                isOpen={isMobileFiltersOpen}
                setOpen={setMobileFiltersOpen}
              />
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1">
              {/* MOBILE FILTERS TOGGLE & SORT */}
              <div className="mb-6 flex items-center justify-between lg:hidden">
                <button
                  onClick={() => setMobileFiltersOpen(!isMobileFiltersOpen)}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <SlidersHorizontal size={18} />
                  Filters
                </button>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                    Sort:
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-gray-950 focus:outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>

              {/* DESKTOP SORT */}
              <div className="mb-6 hidden items-center justify-between lg:flex">
                <p className="text-sm text-gray-600">
                  Showing {filteredProducts.length} products
                </p>
                {/* <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-gray-950 focus:outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                </div> */}
              </div>

              {/* MOBILE FILTERS PANEL */}
              {isMobileFiltersOpen && (
                <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 lg:hidden">
                  <FilterSidebar 
                    filters={filters} 
                    setFilters={setFilters} 
                    resetFilters={handleResetFilters}
                    isOpen={isMobileFiltersOpen}
                    setOpen={setMobileFiltersOpen}
                  />
                </div>
              )}

              {/* PRODUCTS GRID */}
              <ProductGrid productsList={filteredProducts} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function SunglassesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SunglassesContent />
    </Suspense>
  );
}
