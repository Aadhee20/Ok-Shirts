import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdminOrder } from "@/lib/actions/admin-actions";
import { formatPrice, getOrderStatusLabel } from "@/lib/utils";
import { OrderStatusUpdater } from "@/components/admin/order-status-updater";
import { OrderTrackingTimeline } from "@/components/storefront/order-tracking-timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { OrderStatus } from "@prisma/client";

type AdminOrderDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;
  const order = await getAdminOrder(id);

  if (!order) notFound();

  const address = order.shippingAddress as {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  const measurements = order.measurements as Record<string, Record<string, number>>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold">{order.orderNumber}</h1>
          <p className="text-muted-foreground">{order.user.name} · {order.user.email}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/orders">Back to Orders</Link>
        </Button>
      </div>

      <div className="mb-6">
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status as OrderStatus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Order Timeline</CardTitle></CardHeader>
            <CardContent>
              <OrderTrackingTimeline
                currentStatus={order.status}
                statusHistory={order.statusHistory}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Items</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm border-b pb-3">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-muted-foreground">{item.fabric} · Qty: {item.quantity}</p>
                  </div>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold pt-2">
                <span>Total</span>
                <span className="text-forest">{formatPrice(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Measurements</CardTitle></CardHeader>
            <CardContent>
              <pre className="text-sm bg-beige p-4 rounded-lg overflow-auto">
                {JSON.stringify(measurements, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Customer</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="font-medium">{order.user.name}</p>
              <p className="text-muted-foreground">{order.user.email}</p>
              {order.user.phone && <p className="text-muted-foreground">{order.user.phone}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Shipping Address</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <p>{address.street}</p>
              <p>{address.city}, {address.state} {address.zipCode}</p>
              <p>{address.country}</p>
            </CardContent>
          </Card>

          {order.orderNotes && (
            <Card>
              <CardHeader><CardTitle>Special Instructions</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">{order.orderNotes}</CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>Payment</CardTitle></CardHeader>
            <CardContent className="text-sm">
              <p>{order.paymentMethod === "COD" ? "Cash on Delivery" : "Online"}</p>
              <p className="text-muted-foreground mt-1">Status: {getOrderStatusLabel(order.status)}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
