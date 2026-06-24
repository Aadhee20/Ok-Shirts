"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";
import { checkoutSchema } from "@/lib/validators";
import { sendOrderConfirmationEmail } from "@/lib/email";
import type { MeasurementsData } from "@/lib/validators";
import type { CartItem } from "@/store/cart-store";

export async function createOrder(data: {
  items: CartItem[];
  measurements: MeasurementsData;
  address: {
    label: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderNotes?: string;
  paymentMethod: "COD" | "ONLINE";
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "customer") {
    return { error: "You must be logged in to place an order" };
  }

  const parsed = checkoutSchema.safeParse({
    address: data.address,
    orderNotes: data.orderNotes,
    paymentMethod: data.paymentMethod,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid checkout data" };
  }

  if (!data.items.length) {
    return { error: "Your cart is empty" };
  }

  if (!data.measurements || Object.keys(data.measurements).length === 0) {
    return { error: "Measurements are required for tailored items" };
  }

  const subtotal = data.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = subtotal >= 5000 ? 0 : 199;
  const total = subtotal + shippingFee;

  const orderNumber = generateOrderNumber();

  const order = await db.order.create({
    data: {
      orderNumber,
      userId: session.user.id,
      status: "PENDING",
      paymentMethod: data.paymentMethod,
      subtotal,
      shippingFee,
      total,
      shippingAddress: data.address,
      measurements: data.measurements,
      orderNotes: data.orderNotes,
      items: {
        create: data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          fabric: item.fabric,
          fitStyle: (item.fitStyle as "SLIM" | "REGULAR" | "RELAXED") ?? "REGULAR",
        })),
      },
      statusHistory: {
        create: { status: "PENDING", note: "Order placed" },
      },
    },
    include: { user: true },
  });

  await sendOrderConfirmationEmail(order.user.email, order.orderNumber, order.total);

  return { success: true, orderId: order.id, orderNumber: order.orderNumber };
}

export async function getUserOrders(userId: string) {
  return db.order.findMany({
    where: { userId },
    include: {
      items: { include: { product: true } },
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(userId: string, orderId: string) {
  return db.order.findFirst({
    where: { id: orderId, userId },
    include: {
      items: { include: { product: true } },
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function canUserReviewProduct(userId: string, productId: string) {
  const deliveredOrder = await db.order.findFirst({
    where: {
      userId,
      status: "DELIVERED",
      items: { some: { productId } },
    },
  });

  if (!deliveredOrder) return { canReview: false, orderId: null };

  const existingReview = await db.review.findFirst({
    where: { userId, productId, orderId: deliveredOrder.id },
  });

  return { canReview: !existingReview, orderId: deliveredOrder.id };
}

export async function submitReview(data: {
  productId: string;
  orderId: string;
  rating: number;
  comment: string;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "customer") {
    return { error: "You must be logged in" };
  }

  const order = await db.order.findFirst({
    where: {
      id: data.orderId,
      userId: session.user.id,
      status: "DELIVERED",
      items: { some: { productId: data.productId } },
    },
  });

  if (!order) {
    return { error: "You can only review products from delivered orders" };
  }

  await db.review.create({
    data: {
      productId: data.productId,
      userId: session.user.id,
      orderId: data.orderId,
      rating: data.rating,
      comment: data.comment,
      isApproved: false,
    },
  });

  return { success: true };
}

export async function getProductReviews(productId: string) {
  return db.review.findMany({
    where: { productId, isApproved: true },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductAverageRating(productId: string) {
  const result = await db.review.aggregate({
    where: { productId, isApproved: true },
    _avg: { rating: true },
    _count: { rating: true },
  });
  return {
    average: result._avg.rating ?? 0,
    count: result._count.rating,
  };
}
