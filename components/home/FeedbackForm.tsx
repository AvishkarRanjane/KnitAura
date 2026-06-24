"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Star } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const feedbackSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  rating: z.number().min(1, "Please select a rating").max(5),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export default function FeedbackForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: "",
      email: "",
      rating: 0,
      message: "",
    },
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    setIsSubmitting(true);
    try {
      // 1. Post to API which syncs to Google Sheets
      const res = await fetch('/api/sync-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const sheetSynced = res.ok;

      // 2. Save to Firestore
      await addDoc(collection(db, "reviews"), {
        ...data,
        isApproved: false,
        isFeatured: false,
        sheetSynced,
        createdAt: Date.now(),
      });

      toast({
        title: "Thank you for your feedback!",
        description: "Your review has been submitted and is pending approval.",
      });
      
      form.reset();
      setHoveredStar(0);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
      <h3 className="text-2xl font-serif font-bold mb-6 text-center">Share Your Experience</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-center mb-6">
            <FormField control={form.control} name="rating" render={({ field }) => (
              <FormItem className="space-y-1 text-center">
                <FormLabel className="sr-only">Rating</FormLabel>
                <FormControl>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-8 h-8 cursor-pointer transition-colors ${
                          star <= (hoveredStar || field.value)
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/30"
                        }`}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => field.onChange(star)}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="you@example.com" type="email" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>

          <FormField control={form.control} name="message" render={({ field }) => (
            <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea placeholder="Tell us what you think about our products..." className="min-h-[120px]" {...field} /></FormControl><FormMessage /></FormItem>
          )} />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Submit Review
          </Button>
        </form>
      </Form>
    </div>
  );
}
