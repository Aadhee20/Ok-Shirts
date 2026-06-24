import Link from "next/link";
import { Scissors, Truck, Shield, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-beige-dark bg-forest text-beige">
      <div className="container-narrow py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">OK Shirts</h3>
            <p className="text-sm text-beige/80 leading-relaxed">
              Premium custom-stitched shirts, pants, and suits. Crafted with precision for the perfect fit.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-beige/80">
              <li><Link href="/shop?category=shirt" className="hover:text-beige transition-colors">Shirts</Link></li>
              <li><Link href="/shop?category=pant" className="hover:text-beige transition-colors">Pants</Link></li>
              <li><Link href="/shop?category=suit" className="hover:text-beige transition-colors">Suits</Link></li>
              <li><Link href="/shop" className="hover:text-beige transition-colors">All Products</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-beige/80">
              <li><Link href="/size-guide" className="hover:text-beige transition-colors">Size Guide</Link></li>
              <li><Link href="/orders" className="hover:text-beige transition-colors">Track Order</Link></li>
              <li><Link href="/account" className="hover:text-beige transition-colors">My Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Why OK Shirts</h4>
            <ul className="space-y-3 text-sm text-beige/80">
              <li className="flex items-center gap-2"><Scissors className="h-4 w-4" /> Custom Stitched</li>
              <li className="flex items-center gap-2"><Award className="h-4 w-4" /> Premium Fabrics</li>
              <li className="flex items-center gap-2"><Truck className="h-4 w-4" /> Free Shipping ₹5000+</li>
              <li className="flex items-center gap-2"><Shield className="h-4 w-4" /> Quality Guaranteed</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-beige/20 text-center text-sm text-beige/60">
          © {new Date().getFullYear()} OK Shirts. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
