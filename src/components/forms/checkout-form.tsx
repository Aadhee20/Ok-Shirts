"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { createOrder } from "@/lib/actions/order-actions";

export function CheckoutForm() {
  const router = useRouter();
  const { items, measurements, getSubtotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = getSubtotal();
  const shippingFee = subtotal >= 5000 ? 0 : 199;
  const total = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!measurements) {
      setError("Please complete your measurements first");
      router.push("/measurements");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createOrder({
      items,
      measurements,
      address: {
        label: (formData.get("label") as string) || "Home",
        street: formData.get("street") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        zipCode: formData.get("zipCode") as string,
        country: (formData.get("country") as string) || "India",
      },
      orderNotes: (formData.get("orderNotes") as string) || undefined,
      paymentMethod: "COD",
    });

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    clearCart();
    router.push(`/orders/${result.orderId}?confirmed=true`);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="label">Address Label</Label>
              <Input id="label" name="label" defaultValue="Home" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="street">Street Address</Label>
              <Input id="street" name="street" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input id="zipCode" name="zipCode" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" defaultValue="India" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Special Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              name="orderNotes"
              placeholder="Any special stitching instructions or preferences..."
              rows={3}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center gap-3 p-4 border rounded-lg border-forest bg-beige-light cursor-pointer">
              <input type="radio" name="paymentMethod" value="COD" defaultChecked />
              <div>
                <p className="font-medium">Cash on Delivery</p>
                <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
              </div>
            </label>
            <div className="flex items-center gap-3 p-4 border rounded-lg border-beige-dark opacity-50 cursor-not-allowed">
              <input type="radio" name="paymentMethod" value="ONLINE" disabled />
              <div>
                <p className="font-medium">Pay Online</p>
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span>{item.name} × {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "Free" : formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-forest">{formatPrice(total)}</span>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading || items.length === 0}>
              {loading ? "Placing Order..." : "Place Order (COD)"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
