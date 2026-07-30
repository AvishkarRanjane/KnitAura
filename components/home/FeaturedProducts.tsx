"use client";

import { useState, useEffect } from "react";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/lib/types";
import { MOCK_PRODUCTS } from "@/lib/mockProducts";
import ProductCard from "@/components/shop/ProductCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS.slice(0, 4));

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(
          collection(db, "products"),
          where("isActive", "==", true),
          limit(4)
        );
        const querySnapshot = await getDocs(q);
        const featured: Product[] = [];
        querySnapshot.forEach((doc) => {
          featured.push({ id: doc.id, ...doc.data() } as Product);
        });

        if (featured.length > 0) {
          setProducts(featured);
        }
      } catch (error) {
        console.warn("Using mock featured products:", error);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <div>
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-widest">Handcrafted Essentials</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mt-1">Featured Creations</h2>
            <p className="text-muted-foreground mt-1">Our most loved artisanal crochet items.</p>
          </div>
          <Link href="/shop">
            <Button variant="outline" className="rounded-full px-6 border-border/80 hover:bg-muted group">
              Explore All Shop Items
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
