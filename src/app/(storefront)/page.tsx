import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Scissors, Award, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/storefront/product-card";
import { getFeaturedProducts } from "@/lib/actions/admin-actions";
import { getProductAverageRating } from "@/lib/actions/order-actions";

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  const productsWithRatings = await Promise.all(
    featuredProducts.map(async (product) => {
      const rating = await getProductAverageRating(product.id);
      return { product, ...rating };
    })
  );

  return (
    <>
      <section className="relative bg-forest text-beige overflow-hidden">
        <div className="container-narrow py-20 md:py-32">
          <div className="max-w-2xl">
            <p className="text-gold font-medium mb-4 tracking-wide uppercase text-sm">
              Custom Tailored Excellence
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight mb-6">
              Perfectly Stitched.<br />Perfectly You.
            </h1>
            <p className="text-lg text-beige/80 mb-8 leading-relaxed">
              OK Shirts crafts premium shirts, pants, and suits tailored to your exact measurements.
              Classic style meets modern craftsmanship.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" variant="gold">
                <Link href="/shop">Shop Collection <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-beige text-beige hover:bg-beige hover:text-forest">
                <Link href="/size-guide">How to Measure</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 border-b border-beige-dark bg-white">
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <Scissors className="h-8 w-8 text-forest" />
              <h3 className="font-serif font-semibold">Custom Stitched</h3>
              <p className="text-sm text-muted-foreground">Every garment made to your exact measurements</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Award className="h-8 w-8 text-forest" />
              <h3 className="font-serif font-semibold">Premium Fabrics</h3>
              <p className="text-sm text-muted-foreground">Finest cotton, linen, and wool materials</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Ruler className="h-8 w-8 text-forest" />
              <h3 className="font-serif font-semibold">Perfect Fit Guarantee</h3>
              <p className="text-sm text-muted-foreground">Alterations included if needed</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-narrow">
          <h2 className="font-serif text-3xl font-bold text-center mb-10">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Shirts", category: "shirt", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b56?w=600&q=80" },
              { name: "Pants", category: "pant", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80" },
              { name: "Suits", category: "suit", image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80" },
            ].map((cat) => (
              <Link
                key={cat.category}
                href={`/shop?category=${cat.category}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="33vw"
                />
                <div className="absolute inset-0 bg-forest/40 group-hover:bg-forest/50 transition-colors flex items-end p-6">
                  <h3 className="font-serif text-2xl font-bold text-beige">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-beige-light">
        <div className="container-narrow">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-3xl font-bold">Featured Products</h2>
            <Button asChild variant="outline">
              <Link href="/shop">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsWithRatings.map(({ product, average, count }) => (
              <ProductCard
                key={product.id}
                product={product}
                averageRating={average}
                reviewCount={count}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
