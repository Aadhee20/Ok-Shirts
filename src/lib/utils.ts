import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `OKS-${timestamp}-${random}`;
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    SHIRT: "Shirts",
    PANT: "Pants",
    SUIT: "Suits",
  };
  return labels[category] ?? category;
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "Order Placed",
    CONFIRMED: "Confirmed",
    STITCHING: "Stitching",
    QUALITY_CHECK: "Quality Check",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };
  return labels[status] ?? status;
}

export const ORDER_STATUS_STEPS = [
  "PENDING",
  "CONFIRMED",
  "STITCHING",
  "QUALITY_CHECK",
  "SHIPPED",
  "DELIVERED",
] as const;
