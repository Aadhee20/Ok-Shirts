import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CheckoutForm } from "@/components/forms/checkout-form";
import { CheckoutGuard } from "@/components/storefront/checkout-guard";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "customer") {
    redirect("/login?callbackUrl=/checkout");
  }

  return (
    <div className="container-narrow py-10">
      <h1 className="font-serif text-3xl font-bold mb-8">Checkout</h1>
      <CheckoutGuard />
    </div>
  );
}
