import { Category } from "@/types/product";

export const managedHomepageCategoryDefaults: Category[] = [
  {
    id: "cat-clip-on",
    name: "Clip On",
    description: "Versatile clip-on eyewear for adaptable everyday wear.",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=900&auto=format&fit=crop",
    slug: "clip-on",
  },
  {
    id: "cat-turban-frame",
    name: "Turban Frame",
    description: "Comfortable frames designed to fit your style.",
    image: "https://images.unsplash.com/photo-1762331221584-bb856812681e?q=80&w=900&auto=format&fit=crop",
    slug: "turban-frame",
  },
  {
    id: "cat-accessories",
    name: "Accessories",
    description: "Cases and essentials to care for your eyewear.",
    image: "https://images.unsplash.com/photo-1632986636900-a57d247122a2?q=80&w=900&auto=format&fit=crop",
    slug: "accessories",
  },
];

export const categories: Category[] = [
  {
    id: "cat-sunglasses",
    name: "Sunglasses",
    description: "Premium UV protection met with sophisticated, statement-making silhouettes.",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop",
    slug: "sunglasses"
  },
  {
    id: "cat-eyeglasses",
    name: "Eyeglasses",
    description: "Classic & contemporary frames engineered for absolute clarity and daily comfort.",
    image: "https://images.unsplash.com/photo-1577803947579-9f2d05d7f9cf?q=80&w=800&auto=format&fit=crop",
    slug: "eyeglasses"
  },
  {
    id: "cat-contact-lens",
    name: "Contact Lens",
    description: "Custom tint, prescription, and comfort options for daily contact lens wear.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
    slug: "contact-lens"
  },
  managedHomepageCategoryDefaults[0],
  managedHomepageCategoryDefaults[1],
  managedHomepageCategoryDefaults[2],
  {
    id: "cat-bluelight",
    name: "Blue Light",
    description: "Protect your vision in high-definition styling, engineered for the digital environment.",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop",
    slug: "blue-light"
  },
  {
    id: "cat-prescription",
    name: "Prescription Ready",
    description: "Tailored optical lenses custom-fitted to your favorite lightweight frame.",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop",
    slug: "prescription"
  },
];
