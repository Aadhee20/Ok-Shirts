import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { getAdminProducts } from "@/lib/actions/admin-actions";
import { formatPrice, getCategoryLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new"><Plus className="h-4 w-4 mr-2" /> Add Product</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-beige">
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Stock</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4">{getCategoryLabel(product.category)}</td>
                    <td className="p-4">{formatPrice(product.price)}</td>
                    <td className="p-4">
                      <Badge variant={product.stockStatus === "LOW_STOCK" ? "warning" : "secondary"}>
                        {product.stockStatus.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={product.isActive ? "success" : "outline"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteProductButton productId={product.id} productName={product.name} />
                      </div>
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
