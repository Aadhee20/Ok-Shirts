"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      startTransition(() => {
        router.push(`/shop?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    startTransition(() => router.push("/shop"));
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg border border-beige-dark">
      <div>
        <h3 className="font-serif font-semibold text-lg mb-4">Filters</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            defaultValue={searchParams.get("q") ?? ""}
            className="pl-9"
            onChange={(e) => {
              const value = e.target.value;
              const timeout = setTimeout(() => updateParams("q", value), 400);
              return () => clearTimeout(timeout);
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={searchParams.get("category") ?? "all"}
          onValueChange={(v) => updateParams("category", v === "all" ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="shirt">Shirts</SelectItem>
            <SelectItem value="pant">Pants</SelectItem>
            <SelectItem value="suit">Suits</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Min Price (₹)</Label>
        <Input
          type="number"
          placeholder="0"
          defaultValue={searchParams.get("minPrice") ?? ""}
          onBlur={(e) => updateParams("minPrice", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Max Price (₹)</Label>
        <Input
          type="number"
          placeholder="50000"
          defaultValue={searchParams.get("maxPrice") ?? ""}
          onBlur={(e) => updateParams("maxPrice", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Fabric</Label>
        <Input
          placeholder="e.g. Cotton, Linen"
          defaultValue={searchParams.get("fabric") ?? ""}
          onBlur={(e) => updateParams("fabric", e.target.value)}
        />
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters} disabled={isPending}>
        Clear Filters
      </Button>
    </div>
  );
}
