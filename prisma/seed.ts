import bcrypt from "bcryptjs";
import { PrismaClient, Category, FitStyle, StockStatus } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "Classic Oxford Shirt",
    slug: "classic-oxford-shirt",
    description: "Timeless Oxford cotton shirt with a refined collar. Perfect for business and casual occasions. Custom stitched to your measurements.",
    category: Category.SHIRT,
    price: 2499,
    fabric: "Oxford Cotton",
    fitStyle: FitStyle.REGULAR,
    images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b56?w=800&q=80"],
    stockStatus: StockStatus.IN_STOCK,
  },
  {
    name: "Slim Fit Formal Shirt",
    slug: "slim-fit-formal-shirt",
    description: "Elegant slim-fit formal shirt in premium Egyptian cotton. Ideal for office wear and special events.",
    category: Category.SHIRT,
    price: 2999,
    fabric: "Egyptian Cotton",
    fitStyle: FitStyle.SLIM,
    images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80"],
    stockStatus: StockStatus.IN_STOCK,
  },
  {
    name: "Linen Summer Shirt",
    slug: "linen-summer-shirt",
    description: "Breathable linen shirt for warm weather. Relaxed fit with mother-of-pearl buttons.",
    category: Category.SHIRT,
    price: 2799,
    fabric: "Pure Linen",
    fitStyle: FitStyle.RELAXED,
    images: ["https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80"],
    stockStatus: StockStatus.IN_STOCK,
  },
  {
    name: "Classic Chino Pants",
    slug: "classic-chino-pants",
    description: "Versatile chino pants in premium twill fabric. Tailored to your exact waist and inseam measurements.",
    category: Category.PANT,
    price: 3499,
    fabric: "Cotton Twill",
    fitStyle: FitStyle.REGULAR,
    images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80"],
    stockStatus: StockStatus.IN_STOCK,
  },
  {
    name: "Slim Fit Dress Pants",
    slug: "slim-fit-dress-pants",
    description: "Sharp slim-fit dress pants in wool blend. Perfect companion for formal shirts and blazers.",
    category: Category.PANT,
    price: 3999,
    fabric: "Wool Blend",
    fitStyle: FitStyle.SLIM,
    images: ["https://images.unsplash.com/photo-1473966960810-aa6e3720c118?w=800&q=80"],
    stockStatus: StockStatus.IN_STOCK,
  },
  {
    name: "Casual Linen Trousers",
    slug: "casual-linen-trousers",
    description: "Lightweight linen trousers with a relaxed silhouette. Ideal for summer events and casual Fridays.",
    category: Category.PANT,
    price: 3299,
    fabric: "Pure Linen",
    fitStyle: FitStyle.RELAXED,
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80"],
    stockStatus: StockStatus.LOW_STOCK,
  },
  {
    name: "Executive Two-Piece Suit",
    slug: "executive-two-piece-suit",
    description: "Premium two-piece business suit in fine wool. Includes jacket and trousers, fully custom tailored.",
    category: Category.SUIT,
    price: 12999,
    fabric: "Fine Wool",
    fitStyle: FitStyle.REGULAR,
    images: ["https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80"],
    stockStatus: StockStatus.IN_STOCK,
  },
  {
    name: "Slim Fit Wedding Suit",
    slug: "slim-fit-wedding-suit",
    description: "Elegant slim-fit suit for weddings and celebrations. Available in classic navy with satin lapels.",
    category: Category.SUIT,
    price: 14999,
    fabric: "Wool & Silk Blend",
    fitStyle: FitStyle.SLIM,
    images: ["https://images.unsplash.com/photo-1507679799987-c73779514523?w=800&q=80"],
    stockStatus: StockStatus.IN_STOCK,
  },
  {
    name: "Classic Three-Piece Suit",
    slug: "classic-three-piece-suit",
    description: "Distinguished three-piece suit with matching vest. The pinnacle of formal tailoring craftsmanship.",
    category: Category.SUIT,
    price: 17999,
    fabric: "Super 120s Wool",
    fitStyle: FitStyle.REGULAR,
    images: ["https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80"],
    stockStatus: StockStatus.IN_STOCK,
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@okshirts.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@123456";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: "OK Shirts Admin",
    },
  });

  console.log(`Admin created: ${adminEmail}`);

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
