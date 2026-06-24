import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const adminLoginSchema = loginSchema;

export const addressSchema = z.object({
  label: z.string().default("Home"),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(4, "Valid zip code is required"),
  country: z.string().default("India"),
});

export const checkoutSchema = z.object({
  address: addressSchema,
  orderNotes: z.string().optional(),
  paymentMethod: z.enum(["COD", "ONLINE"]).default("COD"),
});

const measurementFields = {
  neck: z.coerce.number().min(10).max(60).optional(),
  chest: z.coerce.number().min(20).max(150).optional(),
  shoulder: z.coerce.number().min(10).max(80).optional(),
  sleeveLength: z.coerce.number().min(10).max(100).optional(),
  shirtLength: z.coerce.number().min(20).max(120).optional(),
  waist: z.coerce.number().min(20).max(150).optional(),
  hips: z.coerce.number().min(20).max(150).optional(),
  inseam: z.coerce.number().min(20).max(120).optional(),
  thigh: z.coerce.number().min(10).max(80).optional(),
  rise: z.coerce.number().min(5).max(50).optional(),
  jacketLength: z.coerce.number().min(30).max(120).optional(),
};

export const measurementProfileSchema = z.object({
  label: z.string().min(1, "Profile name is required"),
  ...measurementFields,
});

export const shirtMeasurementsSchema = z.object({
  neck: z.coerce.number().min(10, "Required").max(60),
  chest: z.coerce.number().min(20, "Required").max(150),
  shoulder: z.coerce.number().min(10, "Required").max(80),
  sleeveLength: z.coerce.number().min(10, "Required").max(100),
  shirtLength: z.coerce.number().min(20, "Required").max(120),
});

export const pantMeasurementsSchema = z.object({
  waist: z.coerce.number().min(20, "Required").max(150),
  hips: z.coerce.number().min(20, "Required").max(150),
  inseam: z.coerce.number().min(20, "Required").max(120),
  thigh: z.coerce.number().min(10, "Required").max(80),
  rise: z.coerce.number().min(5, "Required").max(50),
});

export const suitMeasurementsSchema = z.object({
  neck: z.coerce.number().min(10, "Required").max(60),
  chest: z.coerce.number().min(20, "Required").max(150),
  shoulder: z.coerce.number().min(10, "Required").max(80),
  sleeveLength: z.coerce.number().min(10, "Required").max(100),
  jacketLength: z.coerce.number().min(30, "Required").max(120),
  waist: z.coerce.number().min(20, "Required").max(150),
  hips: z.coerce.number().min(20, "Required").max(150),
  inseam: z.coerce.number().min(20, "Required").max(120),
  thigh: z.coerce.number().min(10, "Required").max(80),
  rise: z.coerce.number().min(5, "Required").max(50),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(10, "Review must be at least 10 characters").max(1000),
});

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().min(10, "Description is required"),
  category: z.enum(["SHIRT", "PANT", "SUIT"]),
  price: z.coerce.number().min(1, "Price must be positive"),
  fabric: z.string().min(2, "Fabric is required"),
  fitStyle: z.enum(["SLIM", "REGULAR", "RELAXED"]).default("REGULAR"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  stockStatus: z.enum(["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK"]).default("IN_STOCK"),
  isActive: z.boolean().default(true),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type MeasurementProfileInput = z.infer<typeof measurementProfileSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;

export type MeasurementsData = {
  shirt?: z.infer<typeof shirtMeasurementsSchema>;
  pant?: z.infer<typeof pantMeasurementsSchema>;
  suit?: z.infer<typeof suitMeasurementsSchema>;
};
