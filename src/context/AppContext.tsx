"use client";

import React, { createContext, useContext, useState, useSyncExternalStore } from "react";
import { Product, ProductConfigurationSelection } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedLens?: string;
  selectedPrescriptionFile?: string;
  configuration?: ProductConfigurationSelection;
  basePrice?: number;
  optionsAmount?: number;
  finalPrice?: number;
}

interface AppContextType {
  cart: CartItem[];
  wishlist: string[]; // product IDs
  addToCart: (product: Product, color: string, quantity?: number, lens?: string, details?: {
    configuration?: ProductConfigurationSelection;
    basePrice?: number;
    optionsAmount?: number;
    finalPrice?: number;
  }) => void;
  removeFromCart: (productId: string, color: string, configuration?: ProductConfigurationSelection) => void;
  updateQuantity: (productId: string, color: string, quantity: number, configuration?: ProductConfigurationSelection) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;

  // UI controls
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setOnboardingOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// FIX: Stable server-side fallback values
const EMPTY_CART: CartItem[] = [];
const EMPTY_WISHLIST: string[] = [];

function getStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  const raw = localStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : fallback;
}

const cartListeners = new Set<() => void>();
const wishlistListeners = new Set<() => void>();
const cartSnapshotRef: { current: CartItem[] } = { current: EMPTY_CART };
const wishlistSnapshotRef: { current: string[] } = { current: EMPTY_WISHLIST };

function notifyCartListeners() {
  cartListeners.forEach((listener) => listener());
}

function notifyWishlistListeners() {
  wishlistListeners.forEach((listener) => listener());
}

function getCartSnapshot(): CartItem[] {
  if (typeof window === "undefined") return cartSnapshotRef.current;

  const next = getStoredValue<CartItem[]>("drishyam_cart", EMPTY_CART);
  if (JSON.stringify(next) !== JSON.stringify(cartSnapshotRef.current)) {
    cartSnapshotRef.current = next;
  }

  return cartSnapshotRef.current;
}

function getWishlistSnapshot(): string[] {
  if (typeof window === "undefined") return wishlistSnapshotRef.current;

  const next = getStoredValue<string[]>("drishyam_wishlist", EMPTY_WISHLIST);
  if (JSON.stringify(next) !== JSON.stringify(wishlistSnapshotRef.current)) {
    wishlistSnapshotRef.current = next;
  }

  return wishlistSnapshotRef.current;
}

function configurationsMatch(
  first?: ProductConfigurationSelection,
  second?: ProductConfigurationSelection
) {
  return JSON.stringify(first ?? { purchaseType: "frame-only" }) ===
    JSON.stringify(second ?? { purchaseType: "frame-only" });
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const cart = useSyncExternalStore(
    (listener) => {
      cartListeners.add(listener);
      return () => cartListeners.delete(listener);
    },
    getCartSnapshot,
    () => EMPTY_CART
  );

  const wishlist = useSyncExternalStore(
    (listener) => {
      wishlistListeners.add(listener);
      return () => wishlistListeners.delete(listener);
    },
    getWishlistSnapshot,
    () => EMPTY_WISHLIST
  );

  const [isCartOpen, setCartOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOnboardingOpen, setOnboardingOpen] = useState(false);

  // Sync state to localStorage
  const saveCart = (newCart: CartItem[]) => {
    cartSnapshotRef.current = newCart;
    localStorage.setItem("drishyam_cart", JSON.stringify(newCart));
    notifyCartListeners();
  };

  const saveWishlist = (newWishlist: string[]) => {
    wishlistSnapshotRef.current = newWishlist;
    localStorage.setItem("drishyam_wishlist", JSON.stringify(newWishlist));
    notifyWishlistListeners();
  };

  const addToCart = (
    product: Product,
    color: string,
    quantity = 1,
    lens = "Standard Clear",
    details?: {
      configuration?: ProductConfigurationSelection;
      basePrice?: number;
      optionsAmount?: number;
      finalPrice?: number;
    }
  ) => {
    const existingIndex = cart.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedColor === color &&
        configurationsMatch(item.configuration, details?.configuration)
    );

    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
      saveCart(newCart);
    } else {
      saveCart([
        ...cart,
        {
          product,
          quantity,
          selectedColor: color,
          selectedLens: lens,
          configuration: details?.configuration,
          basePrice: details?.basePrice ?? product.price,
          optionsAmount: details?.optionsAmount ?? 0,
          finalPrice: details?.finalPrice ?? product.price,
        },
      ]);
    }

    // Automatically open the cart drawer when item is added
    setCartOpen(true);
  };

  const removeFromCart = (productId: string, color: string, configuration?: ProductConfigurationSelection) => {
    const newCart = cart.filter(
      (item) =>
        !(item.product.id === productId &&
          item.selectedColor === color &&
          configurationsMatch(item.configuration, configuration))
    );
    saveCart(newCart);
  };

  const updateQuantity = (
    productId: string,
    color: string,
    quantity: number,
    configuration?: ProductConfigurationSelection
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, color);
      return;
    }

    const newCart = cart.map((item) =>
      item.product.id === productId && item.selectedColor === color
      && configurationsMatch(item.configuration, configuration)
        ? { ...item, quantity }
        : item
    );

    saveCart(newCart);
  };

  const toggleWishlist = (productId: string) => {
    const index = wishlist.indexOf(productId);

    if (index > -1) {
      const newWishlist = wishlist.filter((id) => id !== productId);
      saveWishlist(newWishlist);
    } else {
      saveWishlist([...wishlist, productId]);
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const clearCart = () => saveCart([]);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + (item.finalPrice ?? item.product.price) * item.quantity,
    0
  );

  return (
    <AppContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        isInWishlist,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setCartOpen,
        isSearchOpen,
        setSearchOpen,
        isMobileMenuOpen,
        setMobileMenuOpen,
        isOnboardingOpen,
        setOnboardingOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return context;
}