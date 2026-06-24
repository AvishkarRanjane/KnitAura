"use client";

import Link from "next/link";
import { useSettings } from "@/hooks/useSettings";
import { InlineEdit } from "@/components/ui/inline-edit";

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-muted pt-12 pb-8 border-t">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand & About */}
        <div className="space-y-4">
          <h3 className="text-xl font-serif font-bold text-foreground">
            <InlineEdit settingKey="websiteName" value={settings?.websiteName || ""} />
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            <InlineEdit 
              settingKey="aboutText" 
              value={settings?.aboutText || ""} 
              multiline 
              className="text-sm"
            />
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link href="/shop" className="hover:text-primary transition-colors">Shop</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/cart" className="hover:text-primary transition-colors">Cart</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="font-semibold">Contact Us</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {/* Note: In a full app, you might want a complex editor for nested objects like contactInfo, but here we keep it simpler or require manager to edit via a dedicated settings page if it gets too complex, or we flatten the keys. For simplicity we'll just display them if they exist. */}
            <li>Email: {settings?.contactInfo?.email || "hello@example.com"}</li>
            <li>Phone: {settings?.contactInfo?.phone || "+1 234 567 890"}</li>
            <li>{settings?.contactInfo?.address || "123 Craft Street"}</li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} {settings?.websiteName || "Shop"}. All rights reserved.</p>
      </div>
    </footer>
  );
}
