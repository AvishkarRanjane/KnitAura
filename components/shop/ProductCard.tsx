"use client";

import { Product } from "@/lib/types";
import { useRole } from "@/hooks/useRole";
import { useCartStore } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
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

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    
    addItem({
      productId: product.id,
      title: product.title,
      price: product.discountPrice || product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
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
      <Card className="overflow-hidden group flex flex-col h-full border-border/50 hover:border-border transition-colors">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.title} 
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/20">
              No Image
            </div>
          )}
          
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.isBestSeller && (
              <Badge variant="secondary" className="bg-white/90 text-primary hover:bg-white border-none shadow-sm backdrop-blur-sm">
                Best Seller
              </Badge>
            )}
            {product.discountTag && (
              <Badge variant="destructive" className="bg-destructive/90 hover:bg-destructive border-none shadow-sm backdrop-blur-sm">
                {product.discountTag}
              </Badge>
            )}
          </div>

          {isManager && (
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md" onClick={() => setIsEditing(true)}>
                <Pencil className="w-4 h-4 text-primary" />
              </Button>
              <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full shadow-md" onClick={handleDelete} disabled={isDeleting}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
              <Badge variant="outline" className="bg-background font-bold px-3 py-1 text-sm border-2">Out of Stock</Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{product.category}</div>
          <h3 className="font-serif font-semibold text-lg line-clamp-1 mb-2" title={product.title}>{product.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{product.description}</p>
          
          <div className="flex items-center gap-2 mt-auto">
            {product.discountPrice ? (
              <>
                <span className="font-bold text-lg">₹{product.discountPrice}</span>
                <span className="text-sm text-muted-foreground line-through">₹{product.price}</span>
              </>
            ) : (
              <span className="font-bold text-lg">₹{product.price}</span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full rounded-full" 
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
