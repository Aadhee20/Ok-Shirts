import { getAdminReviews } from "@/lib/actions/admin-actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReviewActions } from "@/components/admin/review-actions";
import { Star } from "lucide-react";

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews();

  const pending = reviews.filter((r) => !r.isApproved);
  const approved = reviews.filter((r) => r.isApproved);

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-8">Reviews</h1>

      <section className="mb-10">
        <h2 className="font-serif text-xl font-semibold mb-4">
          Pending Approval ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-muted-foreground">No reviews pending approval</p>
        ) : (
          <div className="space-y-4">
            {pending.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-medium">{review.user.name}</p>
                        <span className="text-muted-foreground">on</span>
                        <p className="font-medium">{review.product.name}</p>
                      </div>
                      <div className="flex mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? "fill-gold text-gold" : "text-beige-dark"}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                    <ReviewActions reviewId={review.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-serif text-xl font-semibold mb-4">
          Approved Reviews ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <p className="text-muted-foreground">No approved reviews yet</p>
        ) : (
          <div className="space-y-3">
            {approved.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{review.user.name} — {review.product.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{review.comment}</p>
                  </div>
                  <Badge variant="success">Approved</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
