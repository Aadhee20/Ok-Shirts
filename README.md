# OK Shirts

Premium custom-stitched shirts, pants, and suits — an e-commerce website with tailored measurement forms, COD checkout, and a separate admin portal.

## Features

- **Storefront**: Product catalog with search & filters, product detail pages, fabric/fit selectors
- **Custom Measurements**: Required measurement forms for shirts, pants, and suits
- **Shopping Cart & Wishlist**: Persistent cart (Zustand) and user wishlist
- **COD Checkout**: Cash on Delivery with address and special instructions
- **Order Tracking**: Status timeline from Order Placed → Delivered
- **Reviews**: Verified purchase reviews with admin moderation
- **Admin Portal**: Separate login at `/admin/login` — products, orders, reviews, customers
- **Email Notifications**: Order confirmation and status updates (via Resend, optional)

## Tech Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui-style components
- PostgreSQL + Prisma ORM
- NextAuth.js v5 (separate customer & admin auth)
- Zustand (cart/wishlist state)
- Zod (form validation)

## Prerequisites

- Node.js 20+
- PostgreSQL (local, Docker, or [Neon](https://neon.tech) / [Supabase](https://supabase.com) free tier)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env` and update values:

   ```bash
   cp .env.example .env
   ```

   Required variables:
   - `DATABASE_URL` — PostgreSQL connection string
   - `AUTH_SECRET` — Random secret (run `openssl rand -base64 32`)
   - `AUTH_URL` — `http://localhost:3000` for local dev

3. **Set up the database**

   ```bash
   npx prisma migrate dev --name init
   npm run db:seed
   ```

4. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Default Admin Credentials

After seeding (from `.env`):

- **URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@okshirts.com`
- **Password**: `Admin@123456`

Change these in production.

## Project Structure

```
src/
├── app/
│   ├── (storefront)/     # Customer-facing pages
│   ├── admin/
│   │   ├── login/        # Admin login (no sidebar)
│   │   └── (dashboard)/  # Admin portal with sidebar
│   └── api/auth/         # NextAuth routes
├── components/
│   ├── ui/               # Reusable UI components
│   ├── storefront/       # Header, ProductCard, etc.
│   ├── admin/            # AdminSidebar, ProductForm, etc.
│   └── forms/            # Login, Checkout, Measurements, etc.
├── lib/
│   ├── actions/          # Server actions
│   ├── auth.ts           # NextAuth config
│   └── validators/       # Zod schemas
└── store/                # Zustand stores
```

## Customer Flow

1. Browse `/shop` → Add items to cart
2. Go to `/cart` → Continue to `/measurements`
3. Fill required measurements → `/checkout`
4. Place COD order → Track at `/orders/[id]`

## Brand Colors

- Forest Green: `#2D5016`
- Beige: `#F5F0E8`
- Gold accent: `#B8860B`

## Optional: Email Notifications

Set `RESEND_API_KEY` and `EMAIL_FROM` in `.env` to enable order emails. Without it, emails are logged to the console.

## Online Payments

COD is enabled. Online payment (Stripe/Razorpay) is stubbed as "Coming Soon" in checkout — ready for Phase 2 integration.
