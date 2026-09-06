export interface ProductColor {
  name: string;
  hex: string;
}

export interface LensOption {
  id: string;
  name: string;
  price: number;
  description?: string;
  info?: string;
}

export interface CorridorOption {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface VisionTypeOption {
  id: string;
  name: string;
  image: string;
  description?: string;
  lensOptions: LensOption[];
  corridors?: CorridorOption[];
}

export interface ProductLensConfiguration {
  enabled: boolean;
  visionTypes: VisionTypeOption[];
  additionalOptions?: LensOption[];
  prescription?: {
    enabled: boolean;
    required?: boolean;
    accept?: string;
    maxSizeMb?: number;
  };
}

export interface ProductConfigurationSelection {
  purchaseType: "frame-only" | "with-lenses";
  visionType?: string;
  lensType?: string;
  corridor?: string;
  additionalOptions?: string[];
  prescription?: {
    name: string;
    type: string;
    size: number;
    lastModified: number;
    url?: string;
    storagePath?: string;
  };
}

export interface PrescriptionSubmission {
  id: string;
  productId: string;
  productName: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  storagePath: string;
  createdAt: string;
}

import type { StaticImageData } from "next/image";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: "Eyeglasses" | "Sunglasses" | "Blue Light" | "Prescription" | "Prescription Ready" | string;
  shape: "Oval" | "Round" | "Square" | "Heart" | "Diamond" | "Rectangle" | "Aviator" | "Geometric" | "Cat-Eye" | "Wayfarer" | string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  colors: ProductColor[];
  images: Array<string | StaticImageData>; // At least 2 images for hover effect
  gender: "Men" | "Women" | "Kids" | "Unisex";
  material: "Acetate" | "Titanium" | "Metal" | "Eco-Friendly";
  size: "Small" | "Medium" | "Large";
  prescription: boolean;
  description: string;
  details: string[];
  dimensions: string; // e.g. "49-21-145" (lens width - bridge - temple length)
  isBestSeller?: boolean;
  isNew?: boolean;
  lensConfiguration?: ProductLensConfiguration;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
}

export interface FaceShapeRecommendation {
  shape: "Oval" | "Round" | "Square" | "Heart" | "Diamond";
  description: string;
  recommendedShapes: string[];
}
