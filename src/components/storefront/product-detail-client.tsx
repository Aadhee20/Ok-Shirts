"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/store/cart-store";
import type { Product } from "@prisma/client";

const FABRICS = [
  "Cotton",
  "Linen",
  "Wool",
  "Wool Blend",
  "Egyptian Cotton",
  "Oxford Cotton",
];

type ProductDetailClientProps = {
  product: Product;
};

export function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const addItem = useCartStore((s) => s.addItem);

  const [selectedFabric, setSelectedFabric] = React.useState(
    product.fabric
  );

  const [selectedFit, setSelectedFit] = React.useState<
    "REGULAR" | "SLIM" | "RELAXED"
  >(
    (product.fitStyle as "REGULAR" | "SLIM" | "RELAXED") ??
      "REGULAR"
  );

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] ?? "",
      category: product.category,
      fabric: selectedFabric,
      fitStyle: selectedFit,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Fabric</label>

        <Select
          value={selectedFabric}
          onValueChange={setSelectedFabric}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {[
              product.fabric,
              ...FABRICS.filter(
                (f) => f !== product.fabric
              ),
            ].map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Fit Style
        </label>

        <Select
          value={selectedFit}
          onValueChange={(value) =>
            setSelectedFit(
              value as "REGULAR" | "SLIM" | "RELAXED"
            )
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="SLIM">
              Slim Fit
            </SelectItem>

            <SelectItem value="REGULAR">
              Regular Fit
            </SelectItem>

            <SelectItem value="RELAXED">
              Relaxed Fit
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        disabled={
          product.stockStatus === "OUT_OF_STOCK"
        }
      >
        {product.stockStatus === "OUT_OF_STOCK"
          ? "Out of Stock"
          : "Add to Cart"}
      </Button>
    </div>
  );
}