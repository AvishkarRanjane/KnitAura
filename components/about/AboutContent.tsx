"use client";

import { useSettings } from "@/hooks/useSettings";
import { InlineEdit } from "@/components/ui/inline-edit";
import { motion } from "framer-motion";

export default function AboutContent() {
  const { settings } = useSettings();

  return (
    <div className="space-y-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="prose prose-lg dark:prose-invert max-w-none font-serif text-lg leading-loose text-muted-foreground"
      >
        <InlineEdit 
          settingKey="aboutText" 
          value={settings?.aboutText || ""} 
          multiline 
          className="w-full min-h-[300px]"
        />
      </motion.div>
    </div>
  );
}
