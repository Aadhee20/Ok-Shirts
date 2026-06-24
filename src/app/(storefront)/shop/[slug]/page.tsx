import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductDetailClient } from "@/components/storefront/product-detail-client";
import { ReviewForm } from "@/components/forms/review-form";
import { getProductBySlug } from "@/lib/actions/admin-actions";
import {
  getProductReviews,
  getProductAverageRating,
  canUserReviewProduct,
} from "@/lib/actions/order-actions";
import { auth } from "@/lib/auth";
import { formatPrice, getCategoryLabel } from "@/lib/utils";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const [reviews, rating, session] = await Promise.all([
    getProductReviews(product.id),
    getProductAverageRating(product.id),
    auth(),
  ]);

  let reviewEligibility = { canReview: false, orderId: null as string | null };
  if (session?.user?.role === "customer") {
    reviewEligibility = await canUserReviewProduct(session.user.id, product.id);
  }

  return (
    <div className="container-narrow py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-beige">
          <Image
            src={product.images[0] ?? "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="50vw"
          />
        </div>

        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-3">{getCategoryLabel(product.category)}</Badge>
            <h1 className="font-serif text-3xl font-bold">{product.name}</h1>
            {rating.count > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(rating.average) ? "fill-gold text-gold" : "text-beige-dark"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {rating.average.toFixed(1)} ({rating.count} reviews)
                </span>
              </div>
            )}
          </div>

          <p className="text-2xl font-semibold text-forest">{formatPrice(product.price)}</p>
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Fabric:</span>
              <p className="font-medium">{product.fabric}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Fit:</span>
              <p className="font-medium capitalize">{product.fitStyle.toLowerCase()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Availability:</span>
              <p className="font-medium">
                {product.stockStatus === "IN_STOCK"
                  ? "In Stock"
                  : product.stockStatus === "LOW_STOCK"
                  ? "Low Stock"
                  : "Out of Stock"}
              </p>
            </div>
          </div>

          <ProductDetailClient product={product} />

          <p className="text-sm text-muted-foreground">
            All garments are custom stitched to your measurements.{" "}
            <Link href="/size-guide" className="text-forest hover:underline">
              View size guide
            </Link>
          </p>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-serif text-2xl font-bold mb-6">Customer Reviews</h2>

        {reviewEligibility.canReview && reviewEligibility.orderId && (
          <div className="mb-8">
            <ReviewForm productId={product.id} orderId={reviewEligibility.orderId} />
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{review.user.name}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < review.rating ? "fill-gold text-gold" : "text-beige-dark"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(review.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
