"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MeasurementForm } from "@/components/forms/measurement-form";
import { useCartStore } from "@/store/cart-store";
import type { MeasurementProfile } from "@prisma/client";

type MeasurementsGuardProps = {
  userId: string;
  savedProfiles: MeasurementProfile[];
};

export function MeasurementsGuard({ userId, savedProfiles }: MeasurementsGuardProps) {
  const router = useRouter();
  const { items, getCategoriesInCart } = useCartStore();

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  const categories = getCategoriesInCart();

  if (items.length === 0) {
    return null;
  }

  return (
    <MeasurementForm
      categories={categories}
      userId={userId}
      savedProfiles={savedProfiles}
    />
  );
}
