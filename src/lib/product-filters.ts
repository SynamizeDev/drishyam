import type { Product } from "@/types/product";

export function matchesGenderFilter(product: Product, gender: string): boolean {
  const productGender = product.gender.toLowerCase();
  const selectedGender = gender.toLowerCase();

  return productGender === selectedGender
    || (productGender === "unisex" && (selectedGender === "men" || selectedGender === "women"));
}
