import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getWishlistProducts } from "@/lib/actions/user-actions";
import { ProductCard } from "@/components/storefront/product-card";
import { getProductAverageRating } from "@/lib/actions/order-actions";
import { Button } from "@/components/ui/button";

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "customer") {
    redirect("/login?callbackUrl=/wishlist");
  }

  const products = await getWishlistProducts(session.user.id);

  const productsWithRatings = await Promise.all(
    products.map(async (product) => {
      const rating = await getProductAverageRating(product.id);
      return { product, ...rating };
    })
  );

  return (
    <div className="container-narrow py-10">
      <h1 className="font-serif text-3xl font-bold mb-8">My Wishlist</h1>

      {productsWithRatings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-6">Your wishlist is empty.</p>
          <Button asChild>
            <Link href="/shop">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productsWithRatings.map(({ product, average, count }) => (
            <ProductCard
              key={product.id}
              product={product}
              averageRating={average}
              reviewCount={count}
            />
          ))}
        </div>
      )}
    </div>
  );
}
