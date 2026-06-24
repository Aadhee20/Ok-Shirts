import { Suspense } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/storefront/product-card";
import { FilterBar } from "@/components/storefront/filter-bar";
import { getProducts } from "@/lib/actions/admin-actions";
import { getProductAverageRating } from "@/lib/actions/order-actions";
import { Button } from "@/components/ui/button";

type ShopPageProps = {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    fabric?: string;
    q?: string;
    page?: string;
  }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const { products, total, pages } = await getProducts({
    category: params.category,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    fabric: params.fabric,
    q: params.q,
    page,
  });

  const productsWithRatings = await Promise.all(
    products.map(async (product) => {
      const rating = await getProductAverageRating(product.id);
      return { product, ...rating };
    })
  );

  return (
    <div className="container-narrow py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold">Shop</h1>
        <p className="text-muted-foreground mt-2">{total} products found</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <Suspense fallback={<div className="h-96 bg-beige-dark rounded-lg animate-pulse" />}>
            <FilterBar />
          </Suspense>
        </aside>

        <div className="lg:col-span-3">
          {productsWithRatings.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No products found matching your criteria.</p>
              <Button asChild variant="outline" className="mt-4">
                <Link href="/shop">Clear Filters</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {productsWithRatings.map(({ product, average, count }) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    averageRating={average}
                    reviewCount={count}
                  />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      asChild
                      variant={p === page ? "default" : "outline"}
                      size="sm"
                    >
                      <Link
                        href={`/shop?${new URLSearchParams({
                          ...params,
                          page: String(p),
                        } as Record<string, string>).toString()}`}
                      >
                        {p}
                      </Link>
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
