import Link from "next/link";
import { Heart, User, Search } from "lucide-react";
import { auth } from "@/lib/auth";
import { HeaderClient } from "./header-client";
import { CartLink } from "./cart-link";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-beige-dark bg-beige/95 backdrop-blur supports-[backdrop-filter]:bg-beige/80">
      <div className="container-narrow">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold text-forest">OK Shirts</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-sm font-medium text-charcoal hover:text-forest transition-colors">
              Shop All
            </Link>
            <Link href="/shop?category=shirt" className="text-sm font-medium text-charcoal hover:text-forest transition-colors">
              Shirts
            </Link>
            <Link href="/shop?category=pant" className="text-sm font-medium text-charcoal hover:text-forest transition-colors">
              Pants
            </Link>
            <Link href="/shop?category=suit" className="text-sm font-medium text-charcoal hover:text-forest transition-colors">
              Suits
            </Link>
            <Link href="/size-guide" className="text-sm font-medium text-charcoal hover:text-forest transition-colors">
              Size Guide
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/shop" className="p-2 text-charcoal hover:text-forest transition-colors md:hidden">
              <Search className="h-5 w-5" />
            </Link>

            <HeaderClient session={session} />

            {session?.user?.role === "customer" && (
              <>
                <Link href="/wishlist" className="p-2 text-charcoal hover:text-forest transition-colors">
                  <Heart className="h-5 w-5" />
                </Link>
                <Link href="/account" className="p-2 text-charcoal hover:text-forest transition-colors hidden sm:block">
                  <User className="h-5 w-5" />
                </Link>
              </>
            )}

            {!session && (
              <Link href="/login" className="p-2 text-charcoal hover:text-forest transition-colors">
                <User className="h-5 w-5" />
              </Link>
            )}

            <CartLink />
          </div>
        </div>
      </div>
    </header>
  );
}
