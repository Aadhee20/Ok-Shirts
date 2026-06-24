import * as React from "react";
import { cn } from "@/lib/utils";

function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "secondary" | "outline" | "success" | "warning";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          default: "border-transparent bg-forest text-beige",
          secondary: "border-transparent bg-beige-dark text-forest",
          outline: "text-forest border-forest",
          success: "border-transparent bg-green-100 text-green-800",
          warning: "border-transparent bg-amber-100 text-amber-800",
        }[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
