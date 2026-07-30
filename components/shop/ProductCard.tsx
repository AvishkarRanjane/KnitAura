"use client";

import { Product } from "@/lib/types";
import { useRole } from "@/hooks/useRole";
import { useCartStore } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import ProductForm from "@/components/shop/ProductForm";
import { db, rtdb } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { ref as rtdbRef, remove as rtdbRemove } from "firebase/database";

export default function ProductCard({ product }: { product: Product }) {
  const { isManager } = useRole();
  const { addItem } = useCartStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const displayImage = !imageError && product.imageUrl 
    ? product.imageUrl 
    : "/assets/images/crochet-tote-bag.png";

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    
    addItem({
      productId: product.id,
      title: product.title,
      price: product.discountPrice || product.price,
      quantity: 1,
      imageUrl: displayImage,
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.title} has been added to your cart.`,
    });
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "products", product.id));
      await rtdbRemove(rtdbRef(rtdb, `products/${product.id}`));
      toast({ title: "Product Deleted", description: `${product.title} has been removed.` });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({ title: "Error", description: "Failed to delete product.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden group flex flex-col h-full rounded-2xl border border-border/60 hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 bg-card">
        <div className="relative aspect-square overflow-hidden bg-muted/40">
          <img 
            src={displayImage} 
            alt={product.title} 
            onError={() => setImageError(true)}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isBestSeller && (
              <Badge variant="secondary" className="bg-white/90 text-amber-800 hover:bg-white border-none shadow-sm backdrop-blur-sm text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Best Seller
              </Badge>
            )}
            {product.discountTag && (
              <Badge variant="destructive" className="bg-destructive/90 hover:bg-destructive border-none shadow-sm backdrop-blur-sm text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {product.discountTag}
              </Badge>
            )}
          </div>

          {isManager && (
            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md bg-white/90 hover:bg-white" onClick={() => setIsEditing(true)}>
                <Pencil className="w-3.5 h-3.5 text-primary" />
              </Button>
              <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full shadow-md" onClick={handleDelete} disabled={isDeleting}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
          
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center z-10">
              <Badge variant="outline" className="bg-background font-bold px-3 py-1 text-xs border-2 rounded-full">Out of Stock</Badge>
            </div>
          )}
        </div>

        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider mb-1.5">{product.category || "Crochet"}</div>
          <h3 className="font-serif font-bold text-lg text-foreground line-clamp-1 mb-2 group-hover:text-amber-700 transition-colors" title={product.title}>
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1 leading-relaxed">
            {product.description}
          </p>
          
          <div className="flex items-center gap-2 mt-auto">
            {product.discountPrice ? (
              <>
                <span className="font-bold text-xl text-foreground">₹{product.discountPrice}</span>
                <span className="text-sm text-muted-foreground line-through font-medium">₹{product.price}</span>
              </>
            ) : (
              <span className="font-bold text-xl text-foreground">₹{product.price}</span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0">
          <Button 
            className="w-full rounded-full font-medium shadow-sm hover:shadow-md transition-all" 
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            variant={product.stock <= 0 ? "secondary" : "default"}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>

      {isManager && isEditing && (
        <ProductForm 
          product={product} 
          isOpen={isEditing} 
          onClose={() => setIsEditing(false)} 
        />
      )}
    </>
  );
}
