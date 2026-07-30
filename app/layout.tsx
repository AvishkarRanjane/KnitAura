import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ManagerSaveBar from "@/components/manager/ManagerSaveBar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "KnitAura | Handcrafted Luxury Crochet & Sustainable Knitwear",
  description: "Handcrafted luxury crochet products made with love and natural yarns. Discover cozy, sustainable, and beautiful artisanal items.",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.svg"
  },
  openGraph: {
    title: "KnitAura | Handcrafted Luxury Crochet & Sustainable Knitwear",
    description: "Discover handcrafted luxury crochet, artisanal knitwear, and cozy home goods.",
    images: ["/hero-banner.png"],
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}>
        <AuthProvider>
          <SettingsProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <ManagerSaveBar />
            <Toaster />
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
