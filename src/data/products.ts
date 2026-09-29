import { AccessorySubcategory, Product } from "@/types/product";
import { supabase } from "@/lib/supabase";

const PRODUCT_STORAGE_KEY = "drishyam_products";
const ACCESSORY_LOCAL_MIGRATION_KEY = "drishyam_accessory_products_local_v2";
const ACCESSORY_REMOTE_MIGRATION_KEY = "drishyam_accessory_products_remote_v2";

const visionTypeImages = {
  "zero-power": "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=800&auto=format&fit=crop",
  "single-vision": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop",
  bifocal: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800&auto=format&fit=crop",
  progressive: "https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=800&auto=format&fit=crop",
  photochromic: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop",
};

function createBifocalVisionType(): NonNullable<Product["lensConfiguration"]>["visionTypes"][number] {
  return {
    id: "focal",
    name: "Bifocal",
    image: visionTypeImages.bifocal,
    description: "Choose the viewing distance that suits your daily routine.",
    lensOptions: [
      { id: "focal-near", name: "Near Focal", price: 800, description: "Optimized for reading and close-up work." },
      { id: "focal-intermediate", name: "Intermediate Focal", price: 800, description: "Comfortable vision for screens and arm's-length tasks." },
      { id: "focal-distance", name: "Distance Focal", price: 800, description: "Clear vision for walking, driving, and outdoor use." },
      { id: "focal-all", name: "All Focal", price: 1800, description: "Balanced near, intermediate, and distance vision in one lens." },
    ],
  };
}

function ensureFocalVisionType(product: Product): Product {
  const lensConfiguration = product.lensConfiguration;
  if (!lensConfiguration) return product;

  if (lensConfiguration.visionTypes.some((vision) => vision.id === "focal")) {
    return {
      ...product,
      lensConfiguration: {
        ...lensConfiguration,
        visionTypes: lensConfiguration.visionTypes.map((vision) =>
          vision.id === "focal" ? { ...vision, name: "Bifocal" } : vision,
        ),
      },
    };
  }

  return {
    ...product,
    lensConfiguration: {
      ...lensConfiguration,
      visionTypes: [...lensConfiguration.visionTypes, createBifocalVisionType()],
    },
  };
}

function createCatalogLensConfiguration(): Product["lensConfiguration"] {
  return {
    enabled: true,
    visionTypes: [
      {
        id: "zero-power",
        name: "Zero Power",
        image: visionTypeImages["zero-power"],
        lensOptions: [
          { id: "clear-basic", name: "Clear Basic", price: 0, description: "Everyday clear lenses." },
          { id: "blue-light", name: "Blue Light Filter", price: 500, description: "Helps reduce screen glare." },
        ],
      },
      {
        id: "single-vision",
        name: "Single Vision",
        image: visionTypeImages["single-vision"],
        lensOptions: [
          { id: "single-standard", name: "Standard Single Vision", price: 800, description: "Prescription lenses for one viewing distance." },
          { id: "single-premium", name: "Premium Single Vision", price: 1200, description: "Thinner, lighter lenses with premium coating." },
        ],
      },
      createBifocalVisionType(),
      {
        id: "progressive",
        name: "Progressive",
        image: visionTypeImages.progressive,
        lensOptions: [{ id: "progressive-standard", name: "Standard Progressive", price: 1800, description: "Clear vision across viewing distances." }],
        corridors: [
          { id: "standard-corridor", name: "Standard Corridor", price: 0 },
          { id: "wide-corridor", name: "Wider Corridor", price: 600 },
          { id: "maximum-corridor", name: "Maximum Corridor", price: 1000 },
        ],
      },
      {
        id: "photochromic",
        name: "Photochromic",
        image: visionTypeImages.photochromic,
        lensOptions: [{ id: "photochromic-clear", name: "Photochromic Clear to Grey", price: 1500, description: "Darkens outdoors and returns clear indoors." }],
      },
    ],
    additionalOptions: [{ id: "anti-reflective", name: "Anti-reflective coating", price: 300 }],
    prescription: { enabled: true, required: false, accept: ".pdf,image/*", maxSizeMb: 10 },
  };
}

const pexelsImage = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1000`;

const accessoryImageSets: Record<AccessorySubcategory, number[]> = {
  "Lens Care": [5843448, 6334190, 5201902, 5843429, 5842850],
  "Eyewear Cases": [1231065, 33694195, 29604680, 4512812, 5201988, 17633192],
  "Cleaning Wipes & Cloths": [6334190, 5201902, 5843448, 8217234],
  "Eyeglass Chains & Cords": [10220085, 10220086, 10220084, 10176223],
  "Contact Lens Accessories": [5843347, 5843432, 15897969, 5843349, 5843442, 5843429],
  "Nose Pads & Spare Parts": [5715905, 5715901, 9773118, 5201938],
  "Repair Kits & Tools": [5715901, 5715905, 5201938, 5201928],
  "Eyeglass Stands": [5201984, 28211037, 5201989, 5202053, 5201940],
  "Anti-Fog Products": [5843448, 5201902, 6334190],
};

const accessoryDefinitions: Array<{
  name: string;
  accessoryCategory: AccessorySubcategory;
  price: number;
}> = [
  { name: "Lens Cleaning Spray", accessoryCategory: "Lens Care", price: 249 },
  { name: "Lens Cleaning Solution", accessoryCategory: "Lens Care", price: 299 },
  { name: "Lens Cleaning Kit", accessoryCategory: "Lens Care", price: 499 },
  { name: "Screen & Lens Cleaner", accessoryCategory: "Lens Care", price: 349 },
  { name: "Soft Spectacle Case", accessoryCategory: "Eyewear Cases", price: 299 },
  { name: "Sunglass Case", accessoryCategory: "Eyewear Cases", price: 399 },
  { name: "Foldable Case", accessoryCategory: "Eyewear Cases", price: 449 },
  { name: "Protective Pouch", accessoryCategory: "Eyewear Cases", price: 199 },
  { name: "Glasses Storage Box", accessoryCategory: "Eyewear Cases", price: 899 },
  { name: "Wooden Spectacle Case", accessoryCategory: "Eyewear Cases", price: 999 },
  { name: "Travel Eyewear Case", accessoryCategory: "Eyewear Cases", price: 699 },
  { name: "Lens Cleaning Wipes", accessoryCategory: "Cleaning Wipes & Cloths", price: 149 },
  { name: "Premium Cleaning Kit", accessoryCategory: "Cleaning Wipes & Cloths", price: 799 },
  { name: "Eyeglass Chains", accessoryCategory: "Eyeglass Chains & Cords", price: 349 },
  { name: "Spectacle Cords", accessoryCategory: "Eyeglass Chains & Cords", price: 199 },
  { name: "Neck Straps", accessoryCategory: "Eyeglass Chains & Cords", price: 249 },
  { name: "Silicone Retainers", accessoryCategory: "Eyeglass Chains & Cords", price: 149 },
  { name: "Anti-Slip Ear Hooks", accessoryCategory: "Eyeglass Chains & Cords", price: 99 },
  { name: "Designer Eyeglass Chains", accessoryCategory: "Eyeglass Chains & Cords", price: 899 },
  { name: "Beaded Glasses Chains", accessoryCategory: "Eyeglass Chains & Cords", price: 699 },
  { name: "Contact Lens Cases", accessoryCategory: "Contact Lens Accessories", price: 99 },
  { name: "Contact Lens Cleaning Solution", accessoryCategory: "Contact Lens Accessories", price: 249 },
  { name: "Multipurpose Solution", accessoryCategory: "Contact Lens Accessories", price: 299 },
  { name: "Rewetting Drops", accessoryCategory: "Contact Lens Accessories", price: 199 },
  { name: "Contact Lens Travel Kits", accessoryCategory: "Contact Lens Accessories", price: 249 },
  { name: "Contact Lens Tweezers", accessoryCategory: "Contact Lens Accessories", price: 149 },
  { name: "Contact Lens Applicators", accessoryCategory: "Contact Lens Accessories", price: 149 },
  { name: "Universal Silicone Nose Pads", accessoryCategory: "Nose Pads & Spare Parts", price: 149 },
  { name: "Replacement Nose Pads (Screw-In Pair)", accessoryCategory: "Nose Pads & Spare Parts", price: 199 },
  { name: "Nose Pad Screws", accessoryCategory: "Nose Pads & Spare Parts", price: 99 },
  { name: "Frame Screws", accessoryCategory: "Nose Pads & Spare Parts", price: 99 },
  { name: "Temple Screws", accessoryCategory: "Nose Pads & Spare Parts", price: 99 },
  { name: "Replacement Hinges", accessoryCategory: "Nose Pads & Spare Parts", price: 249 },
  { name: "Temple Tips", accessoryCategory: "Nose Pads & Spare Parts", price: 149 },
  { name: "Replacement Temple Tips", accessoryCategory: "Nose Pads & Spare Parts", price: 199 },
  { name: "Replacement Temples", accessoryCategory: "Nose Pads & Spare Parts", price: 399 },
  { name: "Frame Repair Kit", accessoryCategory: "Repair Kits & Tools", price: 399 },
  { name: "Mini Screwdriver Set", accessoryCategory: "Repair Kits & Tools", price: 299 },
  { name: "Eyewear Pliers", accessoryCategory: "Repair Kits & Tools", price: 499 },
  { name: "Eyeglass Stands", accessoryCategory: "Eyeglass Stands", price: 399 },
  { name: "Sunglass Stands", accessoryCategory: "Eyeglass Stands", price: 499 },
  { name: "Display Trays", accessoryCategory: "Eyeglass Stands", price: 799 },
  { name: "Frame Holders", accessoryCategory: "Eyeglass Stands", price: 249 },
  { name: "Lens Display Stands", accessoryCategory: "Eyeglass Stands", price: 599 },
  { name: "Countertop Display Boxes", accessoryCategory: "Eyeglass Stands", price: 1299 },
  { name: "Anti-Fog Spray", accessoryCategory: "Anti-Fog Products", price: 249 },
  { name: "Anti-Fog Wipes", accessoryCategory: "Anti-Fog Products", price: 149 },
];

function createAccessoryProducts(): Product[] {
  const categoryIndexes = new Map<AccessorySubcategory, number>();

  return accessoryDefinitions.map((definition) => {
    const index = categoryIndexes.get(definition.accessoryCategory) ?? 0;
    const photos = accessoryImageSets[definition.accessoryCategory];
    categoryIndexes.set(definition.accessoryCategory, index + 1);
    const slug = definition.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    return {
      id: `accessory-${slug}`,
      name: definition.name,
      slug,
      category: "Accessories",
      accessoryCategory: definition.accessoryCategory,
      shape: "Rectangle",
      price: definition.price,
      rating: 4.7,
      reviewsCount: 0,
      colors: [{ name: "Assorted", hex: "#8b7355" }],
      images: [
        pexelsImage(photos[index % photos.length]),
        pexelsImage(photos[(index + 1) % photos.length]),
      ],
      gender: "Unisex",
      material: "Not Applicable",
      size: "Medium",
      prescription: false,
      description: `${definition.name} for everyday eyewear care, storage, or maintenance.`,
      details: [
        `Category: ${definition.accessoryCategory}`,
        "Check fit and compatibility before purchase.",
        "Images are illustrative; included items may vary by product.",
      ],
      dimensions: "",
      isBestSeller: false,
      isNew: false,
      lensConfiguration: { enabled: false, visionTypes: [] },
    };
  });
}

export const defaultProducts: Product[] = [
  {
    id: "frame-001",
    name: "Avery Classic",
    slug: "avery-classic",
    category: "Eyeglasses",
    shape: "Rectangle",
    price: 249,
    originalPrice: 329,
    rating: 4.8,
    reviewsCount: 124,
    colors: [
      { name: "Obsidian Black", hex: "#111111" },
      { name: "Havana Tortoise", hex: "#70483c" },
      { name: "Clear Crystal", hex: "#e2e8f0" }
    ],
    images: [
      "https://res.cloudinary.com/bc06zmzq/image/upload/v1787046677/20260411_213355.webp",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "Unisex",
    material: "Acetate",
    size: "Medium",
    prescription: true,
    description: "Architectural lines meet everyday comfort. The Avery features a timeless rectangular shape constructed from premium block acetate, hand-polished to a high-gloss finish.",
    details: [
      "Premium Italian Mazzucchelli acetate frame",
      "Robust 5-barrel hinges for extra durability",
      "Anti-reflective, scratch-resistant demo lenses",
      "Comes with custom signature hard case and cleaning cloth"
    ],
    dimensions: "50-20-145",
    isBestSeller: true,
    isNew: false,
    lensConfiguration: {
      enabled: true,
      visionTypes: [
        {
          id: "zero-power",
          name: "Zero Power",
          image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=800&auto=format&fit=crop",
          lensOptions: [
            { id: "clear-basic", name: "Clear Basic", price: 0, description: "Everyday clear lenses for a simple frame-only look." },
            { id: "blue-light", name: "Blue Light Filter", price: 500, description: "Helps reduce screen glare and blue light exposure." },
          ],
        },
        {
          id: "single-vision",
          name: "Single Vision",
          image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop",
          lensOptions: [
            { id: "single-standard", name: "Standard Single Vision", price: 800, description: "Prescription lenses for one viewing distance." },
            { id: "single-premium", name: "Premium Single Vision", price: 1200, description: "Thinner, lighter lenses with premium coating." },
          ],
        },
        {
          id: "progressive",
          name: "Progressive",
          image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800&auto=format&fit=crop",
          lensOptions: [
            { id: "progressive-standard", name: "Standard Progressive", price: 1800, description: "Clear vision across near, intermediate, and distance ranges." },
          ],
          corridors: [
            { id: "standard-corridor", name: "Standard Corridor", price: 0 },
            { id: "wide-corridor", name: "Wider Corridor", price: 600, description: "More room for comfortable intermediate vision." },
            { id: "maximum-corridor", name: "Maximum Corridor", price: 1000, description: "The widest transition area available for this lens." },
          ],
        },
        {
          id: "photochromic",
          name: "Photochromic",
          image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop",
          lensOptions: [
            { id: "photochromic-clear", name: "Photochromic Clear to Grey", price: 1500, description: "Lenses that darken outdoors and return clear indoors." },
          ],
        },
      ],
      additionalOptions: [
        { id: "anti-reflective", name: "Anti-reflective coating", price: 300, description: "Reduces reflections for clearer vision." },
      ],
      prescription: { enabled: true, required: false, accept: ".pdf,image/*", maxSizeMb: 10 },
    },
  },
  {
    id: "frame-002",
    name: "Sienna Round",
    slug: "sienna-round",
    category: "Sunglasses",
    shape: "Round",
    price: 289,
    rating: 4.9,
    reviewsCount: 89,
    colors: [
      { name: "Polished Gold", hex: "#d4af37" },
      { name: "Gunmetal Gray", hex: "#4a5568" }
    ],
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "Women",
    material: "Metal",
    size: "Small",
    prescription: true,
    description: "An elegant, circular metal frame featuring minimalist details. Crafted from ultra-lightweight stainless steel and plated in precious metals.",
    details: [
      "Surgical-grade stainless steel frame",
      "100% UVA/UVB protection optical lenses",
      "Adjustable ceramic nose pads for custom fit",
      "Ultra-thin temples with acetate tips"
    ],
    dimensions: "48-21-140",
    isBestSeller: true,
    isNew: true
  },
  {
    id: "frame-003",
    name: "Vantage Square",
    slug: "vantage-square",
    category: "Eyeglasses",
    shape: "Square",
    price: 269,
    originalPrice: 349,
    rating: 4.7,
    reviewsCount: 56,
    colors: [
      { name: "Charcoal", hex: "#2d3748" },
      { name: "Champagne Toast", hex: "#ebd8be" }
    ],
    images: [
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "Men",
    material: "Acetate",
    size: "Large",
    prescription: true,
    description: "An oversized retro-classic square silhouette designed to stand out. Highly robust acetate frame paired with clean metal rivet details.",
    details: [
      "Handcrafted cellulose acetate",
      "Comfort-fit keyhole bridge",
      "Duraflex flexible temple core",
      "Warm, premium polished finish"
    ],
    dimensions: "52-19-148",
    isBestSeller: false,
    isNew: true
  },
  {
    id: "frame-004",
    name: "Maven Aviator",
    slug: "maven-aviator",
    category: "Sunglasses",
    shape: "Aviator",
    price: 329,
    rating: 4.9,
    reviewsCount: 210,
    colors: [
      { name: "Matte Black", hex: "#1a202c" },
      { name: "Brushed Bronze", hex: "#8c6239" }
    ],
    images: [
      "https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "Unisex",
    material: "Titanium",
    size: "Large",
    prescription: false,
    description: "A reimagined pilot frame constructed from pure Japanese aerospace-grade titanium. Featherlight strength paired with polarized glass lenses.",
    details: [
      "Pure Japanese beta-titanium chassis",
      "Polarized HD glare-reduction lenses",
      "Laser-etched logo branding on temple tips",
      "Ultra-soft silicone saddle nose pads"
    ],
    dimensions: "58-14-142",
    isBestSeller: true,
    isNew: false
  },
  {
    id: "frame-005",
    name: "Koa Geometric",
    slug: "koa-geometric",
    category: "Eyeglasses",
    shape: "Geometric",
    price: 279,
    rating: 4.8,
    reviewsCount: 77,
    colors: [
      { name: "Emerald Moss", hex: "#2f4f4f" },
      { name: "Honey Amber", hex: "#b45309" }
    ],
    images: [
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop"
    ],
    gender: "Women",
    material: "Acetate",
    size: "Medium",
    prescription: true,
    description: "Subtle octagonal styling adds an architectural edge to this soft, versatile profile. Handcrafted from bio-acetate.",
    details: [
      "M2 bio-acetate, 100% biodegradable",
      "Beveled edge contour detailing",
      "Custom wire core engraved with signature pattern",
      "Includes premium velvet-lined protective case"
    ],
    dimensions: "49-20-145",
    isBestSeller: false,
    isNew: false
  },
  {
    id: "accessory-case-leather",
    name: "Classic Leather Eyewear Case",
    slug: "classic-leather-eyewear-case",
    category: "Accessories",
    accessoryCategory: "Eyewear Cases",
    shape: "Rectangle",
    price: 499,
    rating: 4.8,
    reviewsCount: 0,
    colors: [{ name: "Brown", hex: "#795548" }],
    images: [
      "https://images.pexels.com/photos/1231065/pexels-photo-1231065.jpeg?auto=compress&cs=tinysrgb&w=1000",
      "https://images.pexels.com/photos/33694195/pexels-photo-33694195.jpeg?auto=compress&cs=tinysrgb&w=1000",
    ],
    gender: "Unisex",
    material: "Eco-Friendly",
    size: "Medium",
    prescription: false,
    description: "A compact everyday case to help protect your eyewear at home or on the go.",
    details: [
      "Protective case for everyday eyewear storage",
      "Compact shape for bags and travel",
      "Eyeglasses shown in the photos are not included",
    ],
    dimensions: "",
    isBestSeller: false,
    isNew: true,
    lensConfiguration: { enabled: false, visionTypes: [] },
  },
  {
    id: "accessory-case-hard-shell",
    name: "Everyday Hard-Shell Glasses Case",
    slug: "everyday-hard-shell-glasses-case",
    category: "Accessories",
    accessoryCategory: "Eyewear Cases",
    shape: "Rectangle",
    price: 599,
    rating: 4.7,
    reviewsCount: 0,
    colors: [{ name: "Classic Brown", hex: "#6d4c41" }],
    images: [
      "https://images.pexels.com/photos/33694189/pexels-photo-33694189.jpeg?auto=compress&cs=tinysrgb&w=1000",
      "https://images.pexels.com/photos/1231065/pexels-photo-1231065.jpeg?auto=compress&cs=tinysrgb&w=1000",
    ],
    gender: "Unisex",
    material: "Eco-Friendly",
    size: "Medium",
    prescription: false,
    description: "A protective glasses case made for keeping frames together between wears.",
    details: [
      "Protective case for eyeglasses or sunglasses",
      "Easy to carry for daily use and travel",
      "Eyeglasses shown in the photos are not included",
    ],
    dimensions: "",
    isBestSeller: false,
    isNew: true,
    lensConfiguration: { enabled: false, visionTypes: [] },
  },
  {
    id: "accessory-cleaning-cloth",
    name: "Microfiber Eyewear Cleaning Cloth",
    slug: "microfiber-eyewear-cleaning-cloth",
    category: "Accessories",
    accessoryCategory: "Cleaning Wipes & Cloths",
    shape: "Rectangle",
    price: 199,
    rating: 4.8,
    reviewsCount: 0,
    colors: [{ name: "Assorted", hex: "#718096" }],
    images: [
      "https://images.pexels.com/photos/6334194/pexels-photo-6334194.jpeg?auto=compress&cs=tinysrgb&w=1000",
      "https://images.pexels.com/photos/5843448/pexels-photo-5843448.jpeg?auto=compress&cs=tinysrgb&w=1000",
    ],
    gender: "Unisex",
    material: "Eco-Friendly",
    size: "Small",
    prescription: false,
    description: "A soft cloth for wiping fingerprints and everyday smudges from eyewear lenses.",
    details: [
      "For cleaning eyeglass and sunglass lenses",
      "Lightweight and easy to carry",
      "Use with a suitable lens-cleaning solution when needed",
    ],
    dimensions: "",
    isBestSeller: false,
    isNew: true,
    lensConfiguration: { enabled: false, visionTypes: [] },
  },
  ...createAccessoryProducts(),
];

defaultProducts.forEach((product) => {
  if (!product.lensConfiguration) product.lensConfiguration = createCatalogLensConfiguration();
  else Object.assign(product, ensureFocalVisionType(product));
});

export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") {
    return defaultProducts;
  }

  try {
    const raw = window.localStorage.getItem(PRODUCT_STORAGE_KEY);

    if (raw !== null) {
      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        const hasLocalMigration = window.localStorage.getItem(ACCESSORY_LOCAL_MIGRATION_KEY) === "true";
        const migratedProducts = hasLocalMigration
          ? parsed
          : mergeStarterAccessories(parsed as Product[]);

        if (!hasLocalMigration) {
          window.localStorage.setItem(ACCESSORY_LOCAL_MIGRATION_KEY, "true");
          if (JSON.stringify(migratedProducts) !== JSON.stringify(parsed)) {
            window.localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(migratedProducts));
          }
        }

        return migratedProducts.map((product) => ensureFocalVisionType({
          ...product,
          lensConfiguration: product.lensConfiguration ?? getDefaultLensConfiguration(product),
        }));
      }
    }
  } catch {
    // fallback
  }

  return defaultProducts;
}

/*
 * IMPORTANT:
 * Keep the initial exported products static.
 *
 * This prevents localStorage from being read during
 * server rendering, which was causing the hydration mismatch.
 *
 * Your dynamic localStorage functionality is NOT removed.
 * getStoredProducts(), saveProducts(), addProductToCatalog(),
 * deleteProductFromCatalog(), etc. still work exactly the same.
 */
export let products: Product[] = defaultProducts;

function getDefaultLensConfiguration(product: Product) {
  return product.category.toLowerCase() === "accessories"
    ? { enabled: false, visionTypes: [] }
    : createCatalogLensConfiguration();
}

function mergeStarterAccessories(existingProducts: Product[]) {
  const starterAccessories = defaultProducts.filter((product) => product.category === "Accessories");
  const starterById = new Map(starterAccessories.map((product) => [product.id, product]));
  const productsWithSubcategories = existingProducts.map((product) => {
    const starterProduct = starterById.get(product.id);
    return product.category === "Accessories" && starterProduct && !product.accessoryCategory
      ? { ...product, accessoryCategory: starterProduct.accessoryCategory }
      : product;
  });
  const existingIds = new Set(productsWithSubcategories.map((product) => product.id));
  return [
    ...productsWithSubcategories,
    ...starterAccessories.filter((product) => !existingIds.has(product.id)),
  ];
}

export function notifyProductsUpdate() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("drishyam:products-update")
  );
}

export async function saveProducts(nextProducts: Product[]) {
  products = nextProducts;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      PRODUCT_STORAGE_KEY,
      JSON.stringify(nextProducts)
    );
    window.localStorage.setItem(ACCESSORY_LOCAL_MIGRATION_KEY, "true");

    notifyProductsUpdate();
  }

  if (!supabase) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ACCESSORY_REMOTE_MIGRATION_KEY, "true");
    }
    return;
  }

  const { error } = await supabase
    .from("site_data")
    .upsert({ id: "main", products: nextProducts, updated_at: new Date().toISOString() }, { onConflict: "id" });

  if (error) throw error;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ACCESSORY_REMOTE_MIGRATION_KEY, "true");
  }
}

export async function hydrateProducts() {
  if (!supabase) return getStoredProducts();

  const { data, error } = await supabase
    .from("site_data")
    .select("products")
    .eq("id", "main")
    .maybeSingle();

  if (error || !Array.isArray(data?.products)) return getStoredProducts();

  let remoteProductData = data.products as Product[];
  let remoteMigrationSaved = true;

  if (typeof window !== "undefined" && window.localStorage.getItem(ACCESSORY_REMOTE_MIGRATION_KEY) !== "true") {
    const migratedProducts = mergeStarterAccessories(remoteProductData);
    if (JSON.stringify(migratedProducts) !== JSON.stringify(remoteProductData)) {
      const { error: migrationError } = await supabase
        .from("site_data")
        .upsert({ id: "main", products: migratedProducts, updated_at: new Date().toISOString() }, { onConflict: "id" });
      remoteMigrationSaved = !migrationError;
    }
    remoteProductData = migratedProducts;
  }

  const remoteProducts = remoteProductData.map((product) => ensureFocalVisionType({
    ...product,
    lensConfiguration: product.lensConfiguration ?? getDefaultLensConfiguration(product),
  }));
  products = remoteProducts;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(remoteProducts));
    window.localStorage.setItem(ACCESSORY_LOCAL_MIGRATION_KEY, "true");
    if (remoteMigrationSaved) {
      window.localStorage.setItem(ACCESSORY_REMOTE_MIGRATION_KEY, "true");
    }
    notifyProductsUpdate();
  }
  return remoteProducts;
}

export function addProductToCatalog(product: Product) {
  const current = getStoredProducts();

  const nextProducts = [...current, product];

  void saveProducts(nextProducts);

  return product;
}

export function deleteProductFromCatalog(id: string) {
  const current = getStoredProducts();

  const nextProducts = current.filter(
    (p) => p.id !== id
  );

  void saveProducts(nextProducts);

  return nextProducts;
}

export function clearAllCatalogProducts() {
  void saveProducts([]);

  return [];
}

export function restoreDefaultCatalogProducts() {
  void saveProducts([...defaultProducts]);

  return defaultProducts;
}