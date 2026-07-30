"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Product } from "@/lib/types";
import { MOCK_PRODUCTS } from "@/lib/mockProducts";
import { useRole } from "@/hooks/useRole";
import ProductCard from "@/components/shop/ProductCard";
import ShopFilters from "@/components/shop/ShopFilters";
import ProductForm from "@/components/shop/ProductForm";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Sparkles } from "lucide-react";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const { isManager } = useRole();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    // Attempt Firestore fetch with fallback safety
    let isMounted = true;
    try {
      const q = isManager 
        ? query(collection(db, "products"))
        : query(collection(db, "products"), where("isActive", "==", true));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!isMounted) return;
        const fetched: Product[] = [];
        snapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as Product);
        });

        if (fetched.length > 0) {
          setProducts(fetched);
        } else {
          setProducts(MOCK_PRODUCTS);
        }
        setLoading(false);
      }, (error) => {
        console.warn("Firestore shop fetch fallback to mock items:", error);
        if (isMounted) {
          setProducts(MOCK_PRODUCTS);
          setLoading(false);
        }
      });

      return () => {
        isMounted = false;
        unsubscribe();
      };
    } catch (err) {
      console.warn("Firestore error, rendering mock products:", err);
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
    }
  }, [isManager]);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats);
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(lower) || 
        p.description.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower)
      );
    }

    // Category
    if (category !== "All") {
      result = result.filter(p => p.category === category);
    }

    // Sort
    result.sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;

      if (sortBy === "price-asc") return priceA - priceB;
      if (sortBy === "price-desc") return priceB - priceA;
      return b.createdAt - a.createdAt;
    });

    return result;
  }, [products, searchTerm, category, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const currentProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KnitAura Collection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">Artisanal Shop</h1>
          <p className="text-muted-foreground mt-1">Discover handcrafted luxury crochet, cozy apparel, and sustainable home decor.</p>
        </div>
        
        {isManager && (
          <Button onClick={() => setIsAddModalOpen(true)} className="rounded-full shadow-md shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </Button>
        )}
      </div>

      <ShopFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        category={category}
        setCategory={setCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categories={categories}
      />

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
        </div>
      ) : filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-24 bg-muted/20 rounded-3xl border border-dashed border-border/80">
          <h3 className="text-xl font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">Try clearing your search query or category filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <Button 
                variant="outline" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="rounded-full"
              >
                Previous
              </Button>
              <div className="flex items-center px-4 font-medium text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button 
                variant="outline" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="rounded-full"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {isManager && (
        <ProductForm 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
        />
      )}
    </div>
  );
}
