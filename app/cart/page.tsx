"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCartStore } from "@/contexts/CartContext";
import { useRole } from "@/hooks/useRole";
import CartItem from "@/components/cart/CartItem";
import OrderConfirmModal from "@/components/cart/OrderConfirmModal";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, setDoc, doc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(10, "Valid phone number is required"),
  customerAddress: z.string().min(10, "Complete address is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CartPage() {
  const { items, cartTotal, clearCart } = useCartStore();
  const { user } = useRole();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: user?.displayName || "",
      customerEmail: user?.email || "",
      customerPhone: "",
      customerAddress: "",
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const orderId = uuidv4();
      const orderPayload = {
        id: orderId,
        userId: user?.uid || "guest",
        ...data,
        items,
        totalAmount: cartTotal,
        orderStatus: "pending" as const,
        createdAt: Date.now(),
      };

      // 1. Write to Firestore
      await setDoc(doc(db, "orders", orderId), orderPayload);

      // 2. Redirect user directly to WhatsApp with pre-filled message
      const itemsList = items.map(i => `- ${i.quantity}x ${i.title} (₹${i.price})`).join('\n');
      const message = `🛒 *New Order!*\n\n*Customer:* ${data.customerName}\n*Phone:* ${data.customerPhone}\n*Address:* ${data.customerAddress}\n\n*Items:*\n${itemsList}\n\n*Total:* ₹${cartTotal}\n*Order ID:* ${orderId}`;
      
      const whatsappUrl = `https://wa.me/919372889465?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      // 3. Clear Cart & Show Modal
      clearCart();
      setIsModalOpen(true);
      
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Order Failed",
        description: "Something went wrong while placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !isModalOpen) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8 max-w-md">Looks like you haven't added any beautiful crochet items to your cart yet.</p>
        <Link href="/shop">
          <Button size="lg" className="rounded-full px-8">
            Start Shopping <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif font-bold text-foreground mb-10">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="bg-card border rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center justify-between">
              <span>Your Items</span>
              <span className="text-sm font-normal text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </h2>
            <div className="space-y-2">
              {items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Checkout Form & Summary */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-card border rounded-2xl p-6 md:p-8 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span>Calculated on WhatsApp</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">₹{cartTotal}</span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="customerName" render={({ field }) => (
                  <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="customerEmail" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="jane@example.com" type="email" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="customerPhone" render={({ field }) => (
                  <FormItem><FormLabel>Phone Number (for WhatsApp)</FormLabel><FormControl><Input placeholder="+91 9876543210" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="customerAddress" render={({ field }) => (
                  <FormItem><FormLabel>Delivery Address</FormLabel><FormControl><Textarea placeholder="Full address with pincode..." className="min-h-[80px]" {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <Button type="submit" className="w-full mt-6 rounded-full" size="lg" disabled={isSubmitting || items.length === 0}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingBag className="mr-2 h-4 w-4" />}
                  Place Order
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  By placing an order, you agree to our terms. Our manager will contact you on WhatsApp to confirm.
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>

      <OrderConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
