"use client";

import { useSettings } from "@/hooks/useSettings";
import { InlineEdit } from "@/components/ui/inline-edit";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  const { settings } = useSettings();

  return (
    <section className="relative overflow-hidden bg-primary/5 pt-20 pb-32">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6 max-w-4xl mx-auto leading-tight">
            <InlineEdit settingKey="heroHeading" value={settings?.heroHeading || ""} />
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            <InlineEdit settingKey="heroSubheading" value={settings?.heroSubheading || ""} multiline />
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/shop">
            <Button size="lg" className="rounded-full px-8 py-6 text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1">
              Shop the Collection
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
