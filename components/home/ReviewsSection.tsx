"use client";

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Review } from "@/lib/types";
import { useRole } from "@/hooks/useRole";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Check, X, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import FeedbackForm from "./FeedbackForm";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { isManager } = useRole();
  const { toast } = useToast();

  useEffect(() => {
    // If manager, fetch all. If user, fetch only approved.
    const q = isManager
      ? query(collection(db, "reviews"), orderBy("createdAt", "desc"))
      : query(collection(db, "reviews"), where("isApproved", "==", true), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Review[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as Review);
      });
      setReviews(fetched);
    });

    return () => unsubscribe();
  }, [isManager]);

  const toggleApproval = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "reviews", id), { isApproved: !current });
      toast({ title: `Review ${!current ? "Approved" : "Unapproved"}` });
    } catch (e) {
      console.error(e);
      toast({ title: "Error updating review", variant: "destructive" });
    }
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "reviews", id), { isFeatured: !current });
      toast({ title: `Review ${!current ? "Featured" : "Unfeatured"}` });
    } catch (e) {
      console.error(e);
      toast({ title: "Error updating review", variant: "destructive" });
    }
  };

  // Split into featured vs regular if needed, or just display them
  // For users, we might just show featured ones on home page or all approved ones.
  const displayReviews = isManager ? reviews : reviews;

  return (
    <section className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-foreground">What Our Customers Say</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Read stories from people who have brought our crochet creations into their homes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            {displayReviews.length === 0 ? (
              <div className="text-center p-10 bg-card rounded-2xl border text-muted-foreground">
                No reviews yet. Be the first to leave one!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayReviews.map((review) => (
                  <Card key={review.id} className={`h-full ${!review.isApproved && isManager ? 'opacity-70 bg-muted/50 border-dashed' : ''}`}>
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
                        ))}
                      </div>
                      <p className="text-sm italic mb-4 flex-1">"{review.message}"</p>
                      <div className="font-semibold text-sm">— {review.name}</div>
                      
                      {isManager && (
                        <div className="mt-4 pt-4 border-t flex items-center gap-2">
                          <Button size="sm" variant={review.isApproved ? "default" : "outline"} onClick={() => toggleApproval(review.id, review.isApproved)}>
                            {review.isApproved ? <Check className="w-3 h-3 mr-1" /> : null}
                            {review.isApproved ? "Approved" : "Approve"}
                          </Button>
                          <Button size="sm" variant={review.isFeatured ? "secondary" : "outline"} onClick={() => toggleFeatured(review.id, review.isFeatured)}>
                            {review.isFeatured ? <Star className="w-3 h-3 mr-1 fill-current" /> : null}
                            {review.isFeatured ? "Featured" : "Feature"}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <FeedbackForm />
          </div>
        </div>
      </div>
    </section>
  );
}
