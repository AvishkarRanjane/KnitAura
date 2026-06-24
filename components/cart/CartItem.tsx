"use client";

import { OrderItem } from "@/lib/types";
import { useCartStore } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

export default function CartItem({ item }: { item: OrderItem }) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex items-center gap-4 py-4 border-b">
      <div className="w-20 h-20 bg-muted rounded-md overflow-hidden shrink-0">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Image</div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-serif font-semibold text-lg line-clamp-1">{item.title}</h4>
        <div className="text-primary font-bold mt-1">₹{item.price}</div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center border rounded-full overflow-hidden">
          <button 
            type="button"
            className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
            onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
            disabled={item.quantity <= 1}
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
          <button 
            type="button"
            className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
        
        <div className="w-20 text-right font-semibold hidden sm:block">
          ₹{item.price * item.quantity}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={() => removeItem(item.productId)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
