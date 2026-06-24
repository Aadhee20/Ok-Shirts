"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitReview } from "@/lib/actions/order-actions";

type ReviewFormProps = {
  productId: string;
  orderId: string;
};

export function ReviewForm({ productId, orderId }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await submitReview({
      productId,
      orderId,
      rating,
      comment: formData.get("comment") as string,
    });

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    router.refresh();
  };

  if (success) {
    return (
      <p className="text-sm text-green-700 bg-green-50 p-4 rounded-lg">
        Thank you! Your review has been submitted and is pending approval.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-4 bg-beige-light">
      <h4 className="font-serif font-semibold">Write a Review</h4>
      <div className="space-y-2">
        <Label>Rating</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1"
            >
              <Star
                className={`h-6 w-6 ${star <= rating ? "fill-gold text-gold" : "text-beige-dark"}`}
              />
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="comment">Your Review</Label>
        <Textarea id="comment" name="comment" required minLength={10} rows={3} />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" size="sm" disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
