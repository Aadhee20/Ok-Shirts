"use client";

import { Check } from "lucide-react";
import { cn, getOrderStatusLabel, ORDER_STATUS_STEPS } from "@/lib/utils";

type OrderTrackingTimelineProps = {
  currentStatus: string;
  statusHistory: { status: string; note: string | null; createdAt: Date }[];
};

export function OrderTrackingTimeline({ currentStatus, statusHistory }: OrderTrackingTimelineProps) {
  const currentIndex = ORDER_STATUS_STEPS.indexOf(currentStatus as typeof ORDER_STATUS_STEPS[number]);

  return (
    <div className="space-y-0">
      {ORDER_STATUS_STEPS.map((status, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = status === currentStatus;
        const historyEntry = statusHistory.find((h) => h.status === status);

        return (
          <div key={status} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                  isCompleted
                    ? "border-forest bg-forest text-beige"
                    : "border-beige-dark bg-white text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : <span className="text-xs">{index + 1}</span>}
              </div>
              {index < ORDER_STATUS_STEPS.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 h-12",
                    isCompleted && index < currentIndex ? "bg-forest" : "bg-beige-dark"
                  )}
                />
              )}
            </div>

            <div className={cn("pb-8", index === ORDER_STATUS_STEPS.length - 1 && "pb-0")}>
              <p className={cn("font-medium", isCurrent ? "text-forest" : isCompleted ? "text-charcoal" : "text-muted-foreground")}>
                {getOrderStatusLabel(status)}
              </p>
              {historyEntry && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {new Date(historyEntry.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
              {historyEntry?.note && (
                <p className="text-sm text-muted-foreground">{historyEntry.note}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
