import Link from "next/link";
import { Package, ShoppingCart, Star, Users, TrendingUp } from "lucide-react";
import { getAdminStats } from "@/lib/actions/admin-actions";
import { formatPrice, getOrderStatusLabel } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const statCards = [
    { label: "Orders Today", value: stats.ordersToday, icon: ShoppingCart },
    { label: "Total Revenue", value: formatPrice(stats.totalRevenue), icon: TrendingUp },
    { label: "Active Products", value: stats.totalProducts, icon: Package },
    { label: "Total Customers", value: stats.totalCustomers, icon: Users },
    { label: "Pending Reviews", value: stats.pendingReviews, icon: Star },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
                <Icon className="h-8 w-8 text-forest opacity-60" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link href="/admin/orders" className="text-sm text-forest hover:underline">View all</Link>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-muted-foreground">{order.user.name}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{getOrderStatusLabel(order.status)}</Badge>
                      <p className="text-muted-foreground mt-1">{formatPrice(order.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Low Stock Alert</CardTitle>
            <Link href="/admin/products" className="text-sm text-forest hover:underline">Manage</Link>
          </CardHeader>
          <CardContent>
            {stats.lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">All products well stocked</p>
            ) : (
              <div className="space-y-3">
                {stats.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between text-sm">
                    <p className="font-medium">{product.name}</p>
                    <Badge variant="warning">Low Stock</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
