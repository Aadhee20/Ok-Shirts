"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus } from "@/lib/actions/admin-actions";
import { getOrderStatusLabel } from "@/lib/utils";
import type { OrderStatus } from "@prisma/client";

const STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "STITCHING",
  "QUALITY_CHECK",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

type OrderStatusUpdaterProps = {
  orderId: string;
  currentStatus: OrderStatus;
};

export function OrderStatusUpdater({ orderId, currentStatus }: OrderStatusUpdaterProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    await updateOrderStatus(orderId, status);
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-3">
      <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus)}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {getOrderStatusLabel(s)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleUpdate} disabled={loading || status === currentStatus} size="sm">
        {loading ? "Updating..." : "Update Status"}
      </Button>
    </div>
  );
}
