import type { CartItem } from "@/context/AppContext";

const WHATSAPP_NUMBER = "917999965453"; // Store WhatsApp number in international format without +

function encodeMessage(message: string) {
  return encodeURIComponent(message);
}

export function makeBoutiqueInquiryUrl(data: {
  name: string;
  email: string;
  phone: string;
  powerNumber: string;
  productCategory: string;
}) {
  const lines = [
    "Hello Drishyam Optical,",
    "I would like to enquire about a product:",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "Not provided"}`,
    `Product: ${data.productCategory}`,
    `Power number: ${data.powerNumber || "Not provided"}`,
  ];

  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeMessage(lines.join("\n"))}`;
}

export function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function makeWhatsAppUrl(cart: CartItem[]) {
  const baseUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}`;

  if (cart.length === 0) {
    return `${baseUrl}&text=${encodeMessage("Hello Drishyam Optical, I would like to place an order.")}`;
  }

  const subtotal = cart.reduce((total, item) => total + (item.finalPrice ?? item.product.price) * item.quantity, 0);

  const lines: string[] = [
    "Hello Drishyam Optical,",
    "I would like to place an order from your offline store:",
    "",
  ];

  cart.forEach((item, index) => {
    const itemLines = [
      `${index + 1}. ${item.product.name}`,
      `   Color: ${item.selectedColor}`,
      item.configuration?.purchaseType !== "frame-only" && item.selectedLens ? `   Lens: ${item.selectedLens}` : "",
      item.configuration?.visionType ? `   Vision: ${item.configuration.visionType}` : "",
      item.configuration?.corridor ? `   Corridor: ${item.configuration.corridor}` : "",
      `   Quantity: ${item.quantity}`,
      `   Price: ${formatINR((item.finalPrice ?? item.product.price) * item.quantity)}`,
    ];
    lines.push(...itemLines.filter(Boolean));
  });

  lines.push("", `Subtotal: ${formatINR(subtotal)}`);
  lines.push("", "Please let me know when I can collect this order from the store.");

  return `${baseUrl}&text=${encodeMessage(lines.join("\n"))}`;
}
