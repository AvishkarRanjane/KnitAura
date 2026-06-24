"use client";

import { useSettings } from "@/hooks/useSettings";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { useRole } from "@/hooks/useRole";
import { uploadFile } from "@/lib/storage";
import { useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AboutImage() {
  const { settings } = useSettings();
  const { draftSettings, setDraft } = useSettingsStore();
  const { isManager } = useRole();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // Use draft value if it exists, otherwise use saved setting
  const imageUrl = draftSettings?.aboutImageUrl !== undefined 
    ? draftSettings.aboutImageUrl 
    : settings?.aboutImageUrl;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    
    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      setDraft({ aboutImageUrl: url });
      toast({ title: "Image Uploaded", description: "Remember to click 'Save Changes' at the bottom to make it live!" });
    } catch (error) {
      console.error(error);
      toast({ title: "Upload Failed", description: "Failed to upload image. Please try again.", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-muted group">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt="About Us" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-secondary/30 flex items-center justify-center text-muted-foreground p-8 text-center">
          <span className="font-serif italic text-2xl opacity-50">"Stitching memories with every yarn."</span>
        </div>
      )}

      {isManager && (
        <>
          <div className={`absolute inset-0 bg-background/50 flex flex-col items-center justify-center transition-opacity ${imageUrl ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'} cursor-pointer backdrop-blur-sm`} onClick={() => document.getElementById("about-image-upload")?.click()}>
            {isUploading ? (
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            ) : (
              <>
                <ImagePlus className="w-10 h-10 mb-2 text-primary" />
                <span className="text-sm font-medium text-foreground bg-background/80 px-3 py-1 rounded-full shadow-sm">
                  {imageUrl ? "Change Picture" : "Upload Picture"}
                </span>
              </>
            )}
          </div>
          <input 
            id="about-image-upload" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageChange}
            disabled={isUploading}
          />
        </>
      )}
    </div>
  );
}
