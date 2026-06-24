"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal, measurementsComplete } = useCartStore();
  const subtotal = getSubtotal();
  const shippingFee = subtotal >= 5000 ? 0 : 199;

  if (items.length === 0) {
    return (
      <div className="container-narrow py-20 text-center">
        <h1 className="font-serif text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Browse our collection and add items to get started.</p>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-narrow py-10">
      <h1 className="font-serif text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.productId}>
              <CardContent className="flex gap-4 p-4">
                <div className="relative h-24 w-20 rounded overflow-hidden bg-beige flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1">
                  <Link href={`/shop/${item.slug}`} className="font-serif font-semibold hover:text-forest">
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{item.fabric} · {item.fitStyle?.toLowerCase()}</p>
                  <p className="font-semibold text-forest mt-1">{formatPrice(item.price)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeItem(item.productId)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "Free" : formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-4">
                <span>Total</span>
                <span className="text-forest">{formatPrice(subtotal + shippingFee)}</span>
              </div>
              <Button asChild className="w-full">
                <Link href="/measurements">Continue — Add Measurements</Link>
              </Button>
              {!measurementsComplete && (
                <p className="text-xs text-muted-foreground text-center">
                  Measurements required for all tailored items
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
