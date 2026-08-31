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
import { SlidersHorizontal, ChevronDown, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Filters {
  category: string;
  gender: string;
  shape: string;
  material: string;
}

const initialFilters: Filters = {
  category: "eyeglasses",
  gender: "",
  shape: "",
  material: ""
};

function EyeglassesContent() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [allProductsList, setAllProductsList] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [isMobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [siteContent, setSiteContent] = useState<any>(null);

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
    const assignedIds = siteContent?.eyeglassesProductIds ?? [];
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
            <h1 className="text-3xl font-bold text-gray-950">Eyeglasses</h1>
            <p className="mt-2 text-gray-600">
              Discover our premium collection of eyeglasses designed for style and comfort
            </p>
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

export default function EyeglassesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EyeglassesContent />
    </Suspense>
  );
}
