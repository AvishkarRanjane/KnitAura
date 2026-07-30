"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SiteSettings } from "@/lib/types";

interface SettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
}

const defaultSettings: SiteSettings = {
  websiteName: "KnitAura",
  logoUrl: "",
  heroHeading: "Handcrafted Luxury Crochet & Artisanal Knitwear",
  heroSubheading: "Discover cozy, sustainable, and meticulously handcrafted knitwear made with premium natural fibers.",
  aboutText: "At KnitAura, we are passionate about weaving warmth, elegance, and sustainable craftsmanship into every stitch. Each piece is handcrafted with love and natural yarns.",
  faqs: [
    { question: "Are all products 100% handcrafted?", answer: "Yes, every single item in our catalog is individually hand-crocheted by skilled artisans." },
    { question: "How do I care for my crochet items?", answer: "We recommend gentle hand washing in lukewarm water with mild detergent and laying flat to dry." },
    { question: "Do you ship across India & internationally?", answer: "Yes, we provide nationwide express shipping as well as international delivery options." }
  ],
  footerLinks: [],
  socialLinks: { instagram: "https://instagram.com", whatsapp: "https://wa.me/919372889465" },
  contactInfo: { email: "hello@knitaura.com", phone: "+91 9372889465", address: "Craft Studio #4, Creative Enclave, Pune, India" },
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
});

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const docRef = doc(db, "siteSettings", "config");
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setSettings({ ...defaultSettings, ...docSnap.data() } as SiteSettings);
        } else {
          setSettings(defaultSettings);
        }
        setLoading(false);
      }, (error) => {
        console.warn("Using default site settings:", error);
        setSettings(defaultSettings);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn("Firestore listener fallback:", err);
      setSettings(defaultSettings);
      setLoading(false);
    }
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => useContext(SettingsContext);
