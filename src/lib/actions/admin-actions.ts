"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { productSchema } from "@/lib/validators";
import { sendOrderStatusEmail } from "@/lib/email";
import { getOrderStatusLabel } from "@/lib/utils";
import type { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getAdminStats() {
  await requireAdmin();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [ordersToday, totalOrders, totalRevenue, totalProducts, pendingReviews, totalCustomers] =
    await Promise.all([
      db.order.count({ where: { createdAt: { gte: today } } }),
      db.order.count(),
      db.order.aggregate({ _sum: { total: true } }),
      db.product.count({ where: { isActive: true } }),
      db.review.count({ where: { isApproved: false } }),
      db.user.count(),
    ]);

  const recentOrders = await db.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  const lowStockProducts = await db.product.findMany({
    where: { stockStatus: "LOW_STOCK", isActive: true },
    take: 5,
  });

  return {
    ordersToday,
    totalOrders,
    totalRevenue: totalRevenue._sum.total ?? 0,
    totalProducts,
    pendingReviews,
    totalCustomers,
    recentOrders,
    lowStockProducts,
  };
}

export async function getAdminProducts() {
  await requireAdmin();
  return db.product.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getAdminProduct(id: string) {
  await requireAdmin();
  return db.product.findUnique({ where: { id } });
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as "SHIRT" | "PANT" | "SUIT",
    price: formData.get("price") as string,
    fabric: formData.get("fabric") as string,
    fitStyle: (formData.get("fitStyle") as "SLIM" | "REGULAR" | "RELAXED") || "REGULAR",
    images: [(formData.get("image") as string)].filter(Boolean),
    stockStatus: (formData.get("stockStatus") as "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK") || "IN_STOCK",
    isActive: formData.get("isActive") !== "false",
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid product data" };
  }

  const slug = slugify(parsed.data.name);

  const existing = await db.product.findUnique({ where: { slug } });
  if (existing) {
    return { error: "A product with this name already exists" };
  }

  await db.product.create({
    data: { ...parsed.data, slug },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();

  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as "SHIRT" | "PANT" | "SUIT",
    price: formData.get("price") as string,
    fabric: formData.get("fabric") as string,
    fitStyle: (formData.get("fitStyle") as "SLIM" | "REGULAR" | "RELAXED") || "REGULAR",
    images: [(formData.get("image") as string)].filter(Boolean),
    stockStatus: (formData.get("stockStatus") as "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK") || "IN_STOCK",
    isActive: formData.get("isActive") !== "false",
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid product data" };
  }

  await db.product.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await db.product.update({ where: { id }, data: { isActive: false } });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}

export async function getAdminOrders(status?: string) {
  await requireAdmin();
  return db.order.findMany({
    where: status ? { status: status as OrderStatus } : undefined,
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: { include: { product: true } },
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminOrder(id: string) {
  await requireAdmin();
  return db.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: { include: { product: true } },
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, note?: string) {
  await requireAdmin();

  const order = await db.order.update({
    where: { id: orderId },
    data: {
      status,
      statusHistory: {
        create: { status, note: note ?? `Status updated to ${status}` },
      },
    },
    include: { user: true },
  });

  await sendOrderStatusEmail(
    order.user.email,
    order.orderNumber,
    getOrderStatusLabel(status)
  );

  revalidatePath("/admin/orders");
  revalidatePath(`/orders/${orderId}`);
  return { success: true };
}

export async function getAdminReviews(approved?: boolean) {
  await requireAdmin();
  return db.review.findMany({
    where: approved !== undefined ? { isApproved: approved } : undefined,
    include: {
      product: { select: { name: true, slug: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function approveReview(reviewId: string) {
  await requireAdmin();
  await db.review.update({ where: { id: reviewId }, data: { isApproved: true } });
  revalidatePath("/admin/reviews");
  return { success: true };
}

export async function rejectReview(reviewId: string) {
  await requireAdmin();
  await db.review.delete({ where: { id: reviewId } });
  revalidatePath("/admin/reviews");
  return { success: true };
}

export async function getAdminCustomers() {
  await requireAdmin();
  return db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProducts(filters?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  fabric?: string;
  q?: string;
  page?: number;
  limit?: number;
}) {
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 12;
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { isActive: true };

  if (filters?.category) {
    where.category = filters.category.toUpperCase();
  }
  if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) {
      (where.price as Record<string, number>).gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      (where.price as Record<string, number>).lte = filters.maxPrice;
    }
  }
  if (filters?.fabric) {
    where.fabric = { contains: filters.fabric, mode: "insensitive" };
  }
  if (filters?.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
      { fabric: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.product.count({ where }),
  ]);

  return { products, total, pages: Math.ceil(total / limit) };
}

export async function getProductBySlug(slug: string) {
  return db.product.findUnique({ where: { slug, isActive: true } });
}

export async function getFeaturedProducts() {
  return db.product.findMany({
    where: { isActive: true },
    take: 6,
    orderBy: { createdAt: "desc" },
  });
}
