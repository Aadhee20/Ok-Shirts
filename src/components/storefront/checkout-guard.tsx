"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CheckoutForm } from "@/components/forms/checkout-form";
import { useCartStore } from "@/store/cart-store";

export function CheckoutGuard() {
  const router = useRouter();
  const { items, measurementsComplete } = useCartStore();

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    } else if (!measurementsComplete) {
      router.push("/measurements");
    }
  }, [items.length, measurementsComplete, router]);

  if (items.length === 0 || !measurementsComplete) {
    return null;
  }

  return <CheckoutForm />;
}
