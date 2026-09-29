import type { FrameType, Product } from "@/types/product";

export const frameTypeOptions = ["Rimless Frames", "Sheet Frames", "Metal Frames"] as const;

export type { FrameType } from "@/types/product";

export function getProductFrameType(product: Product): FrameType | null {
  if (product.frameType) return product.frameType;

  const productText = [product.name, product.shape, product.description, ...product.details].join(" ");
  if (/\brimless\b/i.test(productText)) return "Rimless Frames";

  if (product.material === "Metal" || product.material === "Titanium") return "Metal Frames";
  if (product.material === "Acetate" || product.material === "Eco-Friendly") return "Sheet Frames";

  return null;
}