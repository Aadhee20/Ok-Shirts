import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserOrders } from "@/lib/actions/order-actions";
import { formatPrice, getOrderStatusLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "customer") {
    redirect("/login?callbackUrl=/orders");
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <div className="container-narrow py-10">
      <h1 className="font-serif text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-6">You haven&apos;t placed any orders yet.</p>
          <Button asChild>
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-sm mt-1">
                      {order.items.length} item{order.items.length > 1 ? "s" : ""} · {formatPrice(order.total)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={order.status === "DELIVERED" ? "success" : "secondary"}>
                      {getOrderStatusLabel(order.status)}
                    </Badge>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/orders/${order.id}`}>Track Order</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
