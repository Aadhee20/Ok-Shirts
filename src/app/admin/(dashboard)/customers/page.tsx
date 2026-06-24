import { getAdminCustomers } from "@/lib/actions/admin-actions";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-8">Customers</h1>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-beige">
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">Phone</th>
                  <th className="text-left p-4 font-medium">Orders</th>
                  <th className="text-left p-4 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b">
                    <td className="p-4 font-medium">{customer.name}</td>
                    <td className="p-4">{customer.email}</td>
                    <td className="p-4 text-muted-foreground">{customer.phone ?? "—"}</td>
                    <td className="p-4">{customer._count.orders}</td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(customer.createdAt).toLocaleDateString("en-IN")}
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
