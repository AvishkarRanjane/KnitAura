"use client";

import { useState, useEffect } from "react";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/lib/types";
import ProductCard from "@/components/shop/ProductCard";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(
          collection(db, "products"),
          where("isActive", "==", true),
          where("isBestSeller", "==", true),
          limit(4)
        );
        const querySnapshot = await getDocs(q);
        const featured: Product[] = [];
        querySnapshot.forEach((doc) => {
          featured.push(doc.data() as Product);
        });
        setProducts(featured);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-serif font-bold text-foreground">Featured Creations</h2>
            <p className="text-muted-foreground mt-2">Our most loved handcrafted items.</p>
          </div>
          <Link href="/shop" className="hidden sm:block">
            <Button variant="outline" className="rounded-full">View All</Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No featured products at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center sm:hidden">
          <Link href="/shop">
            <Button variant="outline" className="rounded-full w-full">View All</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
