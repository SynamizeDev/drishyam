"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProductGridProps {
  productsList: Product[];
  showAll?: boolean;
  loading?: boolean;
}

export function ProductGridSkeleton({
  count = 6,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-label="Loading products"
      className={`grid grid-cols-2 items-start gap-3 sm:gap-5 ${className}`}
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#e7e1d8] bg-white sm:rounded-3xl"
        >
          <div className="aspect-square w-full animate-pulse bg-[#eee9e0]" />
          <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-5">
            <div>
              <div className="mb-3 h-1 w-7 animate-pulse rounded bg-[#eee9e0] sm:w-10" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-[#eee9e0] sm:h-5" />
              <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-[#eee9e0]" />
              <div className="mt-3 h-6 w-2/3 animate-pulse rounded bg-[#eee9e0]" />
            </div>
            <div className="mt-4 space-y-2 border-t border-[#eee9e0] pt-3">
              <div className="h-8 animate-pulse rounded-md bg-[#eee9e0] sm:h-11 sm:rounded-xl" />
              <div className="h-8 animate-pulse rounded-md bg-[#eee9e0] sm:h-11 sm:rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProductGrid({
  productsList,
  showAll = false,
  loading = false,
}: ProductGridProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [wasInitiallyLoading] = useState(loading);
  const [minimumLoadingTimeElapsed, setMinimumLoadingTimeElapsed] = useState(false);

  useEffect(() => {
    if (!wasInitiallyLoading) return;

    const timeout = window.setTimeout(() => {
      setMinimumLoadingTimeElapsed(true);
    }, 650);

    return () => window.clearTimeout(timeout);
  }, [wasInitiallyLoading]);

  if (loading || (wasInitiallyLoading && !minimumLoadingTimeElapsed)) {
    return (
      <ProductGridSkeleton
        count={showAll ? 8 : 6}
        className={isHomePage ? "lg:grid-cols-4" : "lg:grid-cols-3"}
      />
    );
  }

  if (productsList.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-beige-200">
        <p className="text-charcoal/40 text-sm font-light">
          No products found matching those filters.
        </p>
      </div>
    );
  }

  const visibleProducts = showAll ? productsList : productsList.slice(0, 6);

  return (
    <>
      <div
        className={`grid grid-cols-2 items-start gap-3 sm:gap-5 ${
          isHomePage ? "lg:grid-cols-4" : "lg:grid-cols-3"
        }`}
      >
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {productsList.length > 6 && !showAll && (
        <div className="mt-10 flex justify-center">
          <Link
            href="/shop"
            className="rounded-full bg-charcoal px-8 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-charcoal/90"
          >
            See All Products
          </Link>
        </div>
      )}
    </>
  );
}