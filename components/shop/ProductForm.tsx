"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { uploadFile } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ImagePlus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const productSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description needs to be at least 10 characters"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  discountPrice: z.coerce.number().optional().nullable(),
  category: z.string().min(2, "Category is required"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  isBestSeller: z.boolean().default(false),
  isActive: z.boolean().default(true),
  discountTag: z.string().optional().nullable(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductForm({ 
  product, 
  isOpen, 
  onClose 
}: { 
  product?: Product; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl || null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      title: product?.title || "",
      description: product?.description || "",
      price: product?.price || 0,
      discountPrice: product?.discountPrice || null,
      category: product?.category || "Amigurumi",
      stock: product?.stock || 10,
      isBestSeller: product?.isBestSeller || false,
      isActive: product?.isActive ?? true,
      discountTag: product?.discountTag || "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      let imageUrl = product?.imageUrl || "";

      if (imageFile) {
        const path = `products/${uuidv4()}-${imageFile.name}`;
        imageUrl = await uploadFile(imageFile, path);
      }

      if (!imageUrl && !product) {
        toast({ title: "Image required", description: "Please upload an image.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }

      const productData: Partial<Product> = {
        ...data,
        discountPrice: data.discountPrice || undefined,
        discountTag: data.discountTag || undefined,
        imageUrl,
        updatedAt: Date.now(),
      };

      if (product) {
        // Update
        const docRef = doc(db, "products", product.id);
        await updateDoc(docRef, productData);
        toast({ title: "Product Updated", description: "The product was updated successfully." });
      } else {
        // Create
        const newId = uuidv4();
        const docRef = doc(db, "products", newId);
        await setDoc(docRef, {
          ...productData,
          id: newId,
          createdAt: Date.now(),
        });
        toast({ title: "Product Created", description: "The product was created successfully." });
      }
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({ title: "Error", description: "Failed to save product.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Image Upload */}
            <div className="flex flex-col items-center justify-center gap-4">
              <div 
                className="w-32 h-32 relative rounded-xl overflow-hidden bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:bg-accent/10 transition-colors"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground">
                    <ImagePlus className="w-8 h-8 mb-2" />
                    <span className="text-xs">Upload</span>
                  </div>
                )}
                <input 
                  id="image-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField control={form.control} name="price" render={({ field }) => (
                <FormItem><FormLabel>Price (₹)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="discountPrice" render={({ field }) => (
                <FormItem><FormLabel>Discount Price (₹)</FormLabel><FormControl><Input type="number" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="stock" render={({ field }) => (
                <FormItem><FormLabel>Stock</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="discountTag" render={({ field }) => (
                <FormItem><FormLabel>Discount Tag (e.g. 20% OFF)</FormLabel><FormControl><Input {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>

            <div className="flex gap-6 p-4 bg-muted/50 rounded-lg border">
              <FormField control={form.control} name="isBestSeller" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input type="checkbox" checked={field.value} onChange={field.onChange} className="mt-1" />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Best Seller</FormLabel>
                    <p className="text-xs text-muted-foreground">Show on home page.</p>
                  </div>
                </FormItem>
              )} />
              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input type="checkbox" checked={field.value} onChange={field.onChange} className="mt-1" />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active</FormLabel>
                    <p className="text-xs text-muted-foreground">Uncheck to hide product.</p>
                  </div>
                </FormItem>
              )} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {product ? "Save Changes" : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
