"use client";

import { useRole } from "@/hooks/useRole";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ManagerSaveBar() {
  const { isManager } = useRole();
  const { hasUnsavedChanges, saveAll, discard } = useSettingsStore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  if (!isManager) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveAll();
      toast({
        title: "Success",
        description: "All changes saved successfully to the live site.",
      });
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {hasUnsavedChanges && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="container mx-auto">
            <div className="bg-card border shadow-lg rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-accent/20 p-2 rounded-full">
                  <Save className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">You have unsaved changes</h4>
                  <p className="text-xs text-muted-foreground">Save to publish your edits to the live website.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={discard} disabled={isSaving}>
                  <X className="w-4 h-4 mr-2" />
                  Discard
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save All
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
