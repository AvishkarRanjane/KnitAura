"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderConfirmModal({ isOpen, onClose }: OrderConfirmModalProps) {
  const router = useRouter();

  const handleClose = () => {
    onClose();
    router.push("/shop");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-serif text-center">Order Placed Successfully!</DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            ✅ Your order has been placed. The manager will review it and contact you on WhatsApp soon to confirm delivery and payment.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center mt-6">
          <Button onClick={handleClose} size="lg" className="rounded-full px-8">
            Continue Shopping
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
