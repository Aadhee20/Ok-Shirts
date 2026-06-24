import { notFound } from "next/navigation";
import { getAdminProduct } from "@/lib/actions/admin-actions";
import { ProductForm } from "@/components/admin/product-form";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getAdminProduct(id);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold mb-8">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
}
