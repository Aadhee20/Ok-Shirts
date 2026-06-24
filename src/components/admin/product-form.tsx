"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createProduct, updateProduct } from "@/lib/actions/admin-actions";
import type { Product } from "@prisma/client";

type ProductFormProps = {
  product?: Product;
};

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [category, setCategory] = useState<"SHIRT" | "PANT" | "SUIT">(
    (product?.category as "SHIRT" | "PANT" | "SUIT") ?? "SHIRT"
  );

  const [fitStyle, setFitStyle] = useState<
    "REGULAR" | "SLIM" | "RELAXED"
  >(
    (product?.fitStyle as "REGULAR" | "SLIM" | "RELAXED") ?? "REGULAR"
  );

  const [stockStatus, setStockStatus] = useState<
    "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK"
  >(
    (product?.stockStatus as
      | "IN_STOCK"
      | "LOW_STOCK"
      | "OUT_OF_STOCK") ?? "IN_STOCK"
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    formData.set("category", category);
    formData.set("fitStyle", fitStyle);
    formData.set("stockStatus", stockStatus);

    const result = product
      ? await updateProduct(product.id, formData)
      : await createProduct(formData);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {product ? "Edit Product" : "Add New Product"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={product?.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                defaultValue={product?.price}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(value) =>
                  setCategory(value as "SHIRT" | "PANT" | "SUIT")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="SHIRT">Shirt</SelectItem>
                  <SelectItem value="PANT">Pant</SelectItem>
                  <SelectItem value="SUIT">Suit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fabric">Fabric</Label>
              <Input
                id="fabric"
                name="fabric"
                defaultValue={product?.fabric}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Fit Style</Label>
              <Select
                value={fitStyle}
                onValueChange={(value) =>
                  setFitStyle(
                    value as "REGULAR" | "SLIM" | "RELAXED"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="SLIM">Slim</SelectItem>
                  <SelectItem value="REGULAR">Regular</SelectItem>
                  <SelectItem value="RELAXED">Relaxed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Stock Status</Label>
              <Select
                value={stockStatus}
                onValueChange={(value) =>
                  setStockStatus(
                    value as
                      | "IN_STOCK"
                      | "LOW_STOCK"
                      | "OUT_OF_STOCK"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="IN_STOCK">In Stock</SelectItem>
                  <SelectItem value="LOW_STOCK">Low Stock</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">
                    Out of Stock
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={product?.description}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              name="image"
              type="url"
              defaultValue={product?.images?.[0]}
              placeholder="https://images.unsplash.com/..."
              required
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : product
                ? "Update Product"
                : "Create Product"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
