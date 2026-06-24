"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/lib/actions/admin-actions";

type DeleteProductButtonProps = {
  productId: string;
  productName: string;
};

export function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Deactivate "${productName}"? It will be hidden from the shop.`)) return;
    setLoading(true);
    await deleteProduct(productId);
    setLoading(false);
    router.refresh();
  };

  return (
    <Button variant="ghost" size="sm" className="text-destructive" onClick={handleDelete} disabled={loading}>
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
