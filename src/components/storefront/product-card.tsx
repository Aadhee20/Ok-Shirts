"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getCategoryLabel } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useSession } from "next-auth/react";
import { addToWishlistDb, removeFromWishlistDb } from "@/lib/actions/user-actions";
import type { Product } from "@prisma/client";

type ProductCardProps = {
  product: Product;
  averageRating?: number;
  reviewCount?: number;
};

export function ProductCard({ product, averageRating = 0, reviewCount = 0 }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { hasItem, toggleItem, addItem: addWishlist, removeItem: removeWishlist } = useWishlistStore();
  const { data: session } = useSession();
  const inWishlist = hasItem(product.id);

  const handleWishlist = async () => {
    if (!session?.user) {
      window.location.href = "/login?callbackUrl=/shop";
      return;
    }
    toggleItem(product.id);
    if (inWishlist) {
      await removeFromWishlistDb(session.user.id, product.id);
    } else {
      await addToWishlistDb(session.user.id, product.id);
    }
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] ?? "",
      category: product.category,
      fabric: product.fabric,
      fitStyle: product.fitStyle,
    });
  };

  return (
    <div className="group relative bg-white rounded-lg border border-beige-dark overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/shop/${product.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-beige">
          <Image
            src={product.images[0] ?? "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          <Badge className="absolute top-3 left-3" variant="secondary">
            {getCategoryLabel(product.category)}
          </Badge>
        </div>
      </Link>

      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
        aria-label="Add to wishlist"
      >
        <Heart className={`h-4 w-4 ${inWishlist ? "fill-red-500 text-red-500" : "text-charcoal"}`} />
      </button>

      <div className="p-4">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-serif font-semibold text-charcoal hover:text-forest transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-1">{product.fabric}</p>

        {reviewCount > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="font-semibold text-forest">{formatPrice(product.price)}</span>
          <Button size="sm" onClick={handleAddToCart} disabled={product.stockStatus === "OUT_OF_STOCK"}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
