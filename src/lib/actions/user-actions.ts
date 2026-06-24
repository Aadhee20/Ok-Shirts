"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signupSchema } from "@/lib/validators";
import { sendWelcomeEmail } from "@/lib/email";

export async function signupAction(formData: FormData) {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    phone: (formData.get("phone") as string) || undefined,
  };

  const parsed = signupSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { error: "An account with this email already exists" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const user = await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      phone: parsed.data.phone,
    },
  });

  await sendWelcomeEmail(user.email, user.name);

  return { success: true };
}

export async function getUserProfile(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    include: {
      measurementProfiles: { orderBy: { createdAt: "desc" } },
      addresses: { orderBy: { createdAt: "desc" } },
    },
  });
}

export async function saveMeasurementProfile(
  userId: string,
  data: {
    label: string;
    neck?: number;
    chest?: number;
    shoulder?: number;
    sleeveLength?: number;
    shirtLength?: number;
    waist?: number;
    hips?: number;
    inseam?: number;
    thigh?: number;
    rise?: number;
    jacketLength?: number;
  }
) {
  return db.measurementProfile.create({
    data: { userId, ...data },
  });
}

export async function deleteMeasurementProfile(userId: string, profileId: string) {
  const profile = await db.measurementProfile.findFirst({
    where: { id: profileId, userId },
  });
  if (!profile) return { error: "Profile not found" };

  await db.measurementProfile.delete({ where: { id: profileId } });
  return { success: true };
}

export async function getWishlistProducts(userId: string) {
  const items = await db.wishlistItem.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
  return items.map((i) => i.product);
}

export async function syncWishlistToDb(userId: string, productIds: string[]) {
  for (const productId of productIds) {
    await db.wishlistItem.upsert({
      where: { userId_productId: { userId, productId } },
      update: {},
      create: { userId, productId },
    });
  }
}

export async function addToWishlistDb(userId: string, productId: string) {
  await db.wishlistItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: {},
    create: { userId, productId },
  });
}

export async function removeFromWishlistDb(userId: string, productId: string) {
  await db.wishlistItem.deleteMany({ where: { userId, productId } });
}

export async function getUserWishlistIds(userId: string) {
  const items = await db.wishlistItem.findMany({
    where: { userId },
    select: { productId: true },
  });
  return items.map((i) => i.productId);
}
