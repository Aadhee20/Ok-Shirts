import Link from "next/link";
import { getAdminOrders } from "@/lib/actions/admin-actions";
import { formatPrice, getOrderStatusLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type AdminOrdersPageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const { status } = await searchParams;
  const orders = await getAdminOrders(status);

  const statuses = ["", "PENDING", "CONFIRMED", "STITCHING", "QUALITY_CHECK", "SHIPPED", "DELIVERED"];

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-8">Orders</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((s) => (
          <Button
            key={s || "all"}
            asChild
            variant={status === s || (!status && !s) ? "default" : "outline"}
            size="sm"
          >
            <Link href={s ? `/admin/orders?status=${s}` : "/admin/orders"}>
              {s ? getOrderStatusLabel(s) : "All"}
            </Link>
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-beige">
                  <th className="text-left p-4 font-medium">Order</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-4 font-medium">{order.orderNumber}</td>
                    <td className="p-4">
                      <p>{order.user.name}</p>
                      <p className="text-muted-foreground text-xs">{order.user.email}</p>
                    </td>
                    <td className="p-4">{formatPrice(order.total)}</td>
                    <td className="p-4">
                      <Badge variant="secondary">{getOrderStatusLabel(order.status)}</Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="p-4 text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/orders/${order.id}`}>View</Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
