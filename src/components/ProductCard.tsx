// "use client";

// import React, { useState } from "react";
// import { Product } from "@/types/product";
// import { type CartItem, useApp } from "@/context/AppContext";
// import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
// import { makeWhatsAppUrl } from "@/lib/whatsapp";
// import Image from "next/image";
// import Link from "next/link";
// interface ProductCardProps {
//   product: Product;
// }

// function WhatsAppIcon() {
//   return (
//     <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="currentColor">
//       <path d="M20.52 3.48A11.64 11.64 0 0 0 12.02 0C5.48 0 .14 5.31.14 11.85c0 2.09.55 4.13 1.6 5.93L.06 24l6.4-1.66a11.9 11.9 0 0 0 5.56 1.65h.01c6.54 0 11.88-5.31 11.88-11.85 0-3.17-1.24-6.15-3.39-8.37ZM12.02 21.6c-1.79 0-3.55-.48-5.08-1.39l-.36-.22-3.8.99 1.02-3.7-.24-.38A9.75 9.75 0 0 1 2.22 11.85C2.22 6.77 6.38 2.62 12.02 2.62c5.65 0 10.25 4.15 10.25 9.23 0 5.08-4.6 9.23-10.25 9.23Zm5.64-6.9c-.31-.16-1.81-.89-2.1-1-.28-.12-.49-.16-.7.16-.2.31-.78 1-.96 1.2-.18.16-.35.18-.66.06-.3-.16-1.28-.47-2.43-1.5-.9-.81-1.5-1.8-1.68-2.1-.18-.31-.02-.47.14-.62.14-.14.31-.35.46-.53.15-.17.2-.29.3-.48.1-.2.05-.37-.02-.52-.08-.16-.7-1.71-.96-2.34-.26-.62-.52-.53-.7-.54l-.6-.01c-.2 0-.53.08-.81.38-.28.31-1.07 1.05-1.07 2.56 0 1.52 1.1 2.96 1.26 3.17.16.2 2.17 3.31 5.26 4.64.74.32 1.32.51 1.77.66.74.24 1.42.2 1.95.13.6-.09 1.81-.74 2.07-1.46.25-.71.25-1.33.17-1.46-.08-.13-.28-.2-.58-.36Z" />
//     </svg>
//   );
// }

// export default function ProductCard({ product }: ProductCardProps) {
//   const { toggleWishlist, isInWishlist, addToCart } = useApp();
//   const [hovered, setHovered] = useState(false);

//   const isLiked = isInWishlist(product.id);

//   const selectedColor = product.colors[0];

//   const handleQuickAdd = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//     addToCart(product, selectedColor.name, 1);
//   };

//   const handleEnquireNow = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const item: CartItem = {
//       product,
//       quantity: 1,
//       selectedColor: selectedColor.name,
//     };

//     window.open(makeWhatsAppUrl([item]), "_blank", "noopener,noreferrer");
//   };
//   return (
//     <div
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       className="group relative flex w-full max-w-full rounded-2xl flex-col overflow-hidden border border-[#e8e2d8] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a15b] hover:shadow-[0_22px_45px_rgba(35,31,26,0.12)]"
//     >
      
//       {/* Wishlist Button */}
//       <button
//         onClick={() => toggleWishlist(product.id)}
//    className="absolute right-4 top-4 z-20 rounded-full border border-white/40 bg-white/20 p-2 text-charcoal/80 shadow-[0_8px_32px_rgba(31,38,135,0.12)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-red-300/70 hover:bg-red-500/10 hover:text-red-500"
//         aria-label="Add to wishlist"
//       >
//         <Heart className={`w-4 h-4 transition-colors ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
//       </button>

//       {/* Image container with hover effect and Indian aesthetic border */}
//       <Link href={`/product/${product.slug}`} className="relative block overflow-hidden bg-[#f3efe8]">
//         <div className="relative aspect-[2/2] w-full">
//           <Image
//             src={hovered && product.images[1] ? product.images[1] : product.images[0]}
//             alt={product.name}
//             fill
//             unoptimized={true}
//             className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
//             sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//           />
//         </div>

//         {/* Quick Add Overlay with gradient */}
//         <div className="absolute inset-x-0 bottom-0 z-10 flex translate-y-0 gap-2 justify-center bg-gradient-to-t from-[#171512]/90 via-[#171512]/45 to-transparent p-3 pt-12 opacity-100 transition-all duration-300 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
//           <button
//             onClick={handleQuickAdd}
//             className="btn-primary flex-1 rounded-lg bg-[#c18b3c] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white shadow-lg transition-all hover:bg-[#a9752d] sm:text-xs"
//           >
//             <ShoppingBag className="w-3.5 h-3.5" />
//             <span>Quick Add</span>
//           </button>
//           <button
//             className="border border-white/70 bg-white/95 p-2 text-charcoal transition-all hover:bg-white hover:shadow-lg"
//             aria-label="Quick View"
//           >
//             <Eye className="w-3.5 h-3.5" />
//           </button>
//         </div>
//       </Link>

//       {/* Product Details */}
// <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
//   <div>
//     <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.16em] text-charcoal/50">
//       <span>
//         {product.shape} {product.category}
//       </span>

//       <div className="flex items-center gap-1 text-saffron">
//         <Star className="h-3.5 w-3.5 fill-[#c18b3c] text-[#c18b3c]" />
//         <span className="text-sm font-semibold text-charcoal">
//           {product.rating}
//         </span>
//       </div>
//     </div>

//     <div className="flex items-center justify-between">
//       <h3 className="mb-2 text-base font-semibold leading-tight text-charcoal transition-colors group-hover:text-[#a9752d] sm:text-lg">
//         <Link href={`/product/${product.slug}`}>
//           {product.name}
//         </Link>
//       </h3>
//     </div>
//   </div>

//   <div className="border-t border-[#eee9e0] pt-4">
//     <button
//       type="button"
//       onClick={handleEnquireNow}
//       className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25a65a] py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-sm transition-all hover:bg-[#208c4d] sm:py-2 sm:text-xs"
//     >
//       <WhatsAppIcon size={16} />
//       <span>Enquire now</span>
//     </button>

//     <Link
//       href={`/product/${product.slug}`}
//       className="btn-secondary mt-2 flex w-full items-center justify-center gap-2 !rounded-lg border border-[#231f1a] bg-white py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#231f1a] transition-all hover:bg-[#231f1a] hover:text-white sm:py-2 sm:text-xs"
//     >
//       <span>View Details</span>
//     </Link>
//   </div>
// </div>
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import { Product } from "@/types/product";
import { type CartItem, useApp } from "@/context/AppContext";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { makeWhatsAppUrl } from "@/lib/whatsapp";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="currentColor"
    >
      <path d="M20.52 3.48A11.64 11.64 0 0 0 12.02 0C5.48 0 .14 5.31.14 11.85c0 2.09.55 4.13 1.6 5.93L.06 24l6.4-1.66a11.9 11.9 0 0 0 5.56 1.65h.01c6.54 0 11.88-5.31 11.88-11.85 0-3.17-1.24-6.15-3.39-8.37ZM12.02 21.6c-1.79 0-3.55-.48-5.08-1.39l-.36-.22-3.8.99 1.02-3.7-.24-.38A9.75 9.75 0 0 1 2.22 11.85C2.22 6.77 6.38 2.62 12.02 2.62c5.65 0 10.25 4.15 10.25 9.23 0 5.08-4.6 9.23-10.25 9.23Zm5.64-6.9c-.31-.16-1.81-.89-2.1-1-.28-.12-.49-.16-.7.16-.2.31-.78 1-.96 1.2-.18.16-.35.18-.66.06-.3-.16-1.28-.47-2.43-1.5-.9-.81-1.5-1.8-1.68-2.1-.18-.31-.02-.47.14-.62.14-.14.31-.35.46-.53.15-.17.2-.29.3-.48.1-.2.05-.37-.02-.52-.08-.16-.7-1.71-.96-2.34-.26-.62-.52-.53-.7-.54l-.6-.01c-.2 0-.53.08-.81.38-.28.31-1.07 1.05-1.07 2.56 0 1.52 1.1 2.96 1.26 3.17.16.2 2.17 3.31 5.26 4.64.74.32 1.32.51 1.77.66.74.24 1.42.2 1.95.13.6-.09 1.81-.74 2.07-1.46.25-.71.25-1.33.17-1.46-.08-.13-.28-.2-.58-.36Z" />
    </svg>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist, addToCart } = useApp();
  const [hovered, setHovered] = useState(false);

  const isLiked = isInWishlist(product.id);
  const selectedColor = product.colors[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedColor.name, 1);
  };

  const handleEnquireNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const item: CartItem = {
      product,
      quantity: 1,
      selectedColor: selectedColor.name,
    };

    window.open(
      makeWhatsAppUrl([item]),
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-[#e7e1d8] bg-white transition-all duration-500 hover:-translate-y-2 hover:border-[#c9a15b]/60 hover:shadow-[0_30px_70px_rgba(35,31,26,0.14)]"
    >
      {/* Decorative animated top line */}
      <div className="absolute left-0 top-0 z-30 h-0.75 w-full origin-left scale-x-0 bg-linear-to-r from-[#c18b3c] via-[#f0c878] to-[#c18b3c] transition-transform duration-700 group-hover:scale-x-100" />

      {/* IMAGE */}
      <div className="relative overflow-hidden bg-[#f3efe8]">
        <Link href={`/product/${product.slug}`} className="block">
          <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={
              hovered && product.images[1]
                ? product.images[1]
                : product.images[0]
            }
            alt={product.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Image overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-[#171512]/60 via-transparent to-[#171512]/10 opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Existing category data */}
          <div className="absolute left-4 top-4 z-10 rounded-full border border-white/40 bg-white/75 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#231f1a] shadow-md backdrop-blur-md">
            {product.shape} {product.category}
          </div>
          </div>
        </Link>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/75 text-[#231f1a] shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:text-red-500 active:scale-95"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`h-4 w-4 transition-all duration-300 ${
              isLiked ? "scale-110 fill-red-500 text-red-500" : ""
            }`}
          />
        </button>

        {/* QUICK ACTIONS */}
        <div className="absolute inset-x-0 bottom-0 z-20 bg-linear-to-t from-[#171512]/80 via-[#171512]/30 to-transparent px-4 pb-4 pt-14">
          <div className="flex translate-y-0 gap-2 transition-all duration-500 sm:translate-y-6 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#d6a354] px-3 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#211f1b] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e1b667] active:scale-[0.98] sm:text-xs"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Quick Add</span>
            </button>

            <Link
              href={`/product/${product.slug}`}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-[#231f1a] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
              aria-label="Quick View"
            >
              <Eye className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="mb-3 h-px w-10 bg-[#d6a354] transition-all duration-500 group-hover:w-20" />

          <h3 className="text-lg font-bold leading-snug text-[#231f1a] transition-colors duration-300 group-hover:text-[#a9752d] sm:text-xl">
            <Link href={`/product/${product.slug}`}>
              {product.name}
            </Link>
          </h3>
        </div>

        {/* EXISTING ACTIONS ONLY */}
        <div className="mt-2 grid gap-2 border-t border-[#eee9e0] pt-4">
          <button
            type="button"
            onClick={handleEnquireNow}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25a65a] py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_8px_20px_rgba(37,166,90,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#208c4d] hover:shadow-[0_12px_28px_rgba(37,166,90,0.28)] active:scale-[0.98] sm:text-xs"
          >
            <WhatsAppIcon />
            <span>Enquire Now</span>
          </button>

          <Link
            href={`/product/${product.slug}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#231f1a] bg-white py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[#231f1a] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#231f1a] hover:text-white active:scale-[0.98] sm:text-xs"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>View Details</span>
          </Link>
        </div>
      </div>

      {/* Decorative corner glow */}
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[#d6a354]/10 blur-3xl transition-all duration-700 group-hover:bg-[#d6a354]/20" />
    </article>
  );
}