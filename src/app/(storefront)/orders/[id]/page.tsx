import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getOrderById } from "@/lib/actions/order-actions";
import { formatPrice, getOrderStatusLabel } from "@/lib/utils";
import { OrderTrackingTimeline } from "@/components/storefront/order-tracking-timeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type OrderDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ confirmed?: string }>;
};

export default async function OrderDetailPage({ params, searchParams }: OrderDetailPageProps) {
  const session = await auth();
  if (!session?.user || session.user.role !== "customer") {
    redirect("/login?callbackUrl=/orders");
  }

  const { id } = await params;
  const { confirmed } = await searchParams;
  const order = await getOrderById(session.user.id, id);

  if (!order) notFound();

  const address = order.shippingAddress as {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  return (
    <div className="container-narrow py-10">
      {confirmed === "true" && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          Order placed successfully! You will receive a confirmation email shortly.
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold">{order.orderNumber}</h1>
          <p className="text-muted-foreground mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN")}
          </p>
        </div>
        <Badge>{getOrderStatusLabel(order.status)}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTrackingTimeline
                currentStatus={order.status}
                statusHistory={order.statusHistory}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-muted-foreground">
                      {item.fabric} · Qty: {item.quantity}
                    </p>
                  </div>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shippingFee === 0 ? "Free" : formatPrice(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between font-semibold text-base border-t pt-2">
                <span>Total</span>
                <span className="text-forest">{formatPrice(order.total)}</span>
              </div>
              <p className="text-muted-foreground pt-2">Payment: Cash on Delivery</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>{address.street}</p>
              <p>{address.city}, {address.state} {address.zipCode}</p>
              <p>{address.country}</p>
            </CardContent>
          </Card>

          {order.orderNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Special Instructions</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {order.orderNotes}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Button asChild variant="outline">
          <Link href="/orders">Back to Orders</Link>
        </Button>
      </div>
    </div>
  );
}
