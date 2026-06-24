"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { approveReview, rejectReview } from "@/lib/actions/admin-actions";

type ReviewActionsProps = {
  reviewId: string;
};

export function ReviewActions({ reviewId }: ReviewActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    await approveReview(reviewId);
    setLoading(false);
    router.refresh();
  };

  const handleReject = async () => {
    if (!confirm("Reject and delete this review?")) return;
    setLoading(true);
    await rejectReview(reviewId);
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" onClick={handleApprove} disabled={loading}>Approve</Button>
      <Button size="sm" variant="outline" onClick={handleReject} disabled={loading}>Reject</Button>
    </div>
  );
}
