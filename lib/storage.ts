import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export { storage, ref, uploadBytes, getDownloadURL, deleteObject };

/**
 * Uploads a file to ImgBB (Free Image Hosting) and returns the download URL.
 * This is much faster than Firebase Storage and requires no setup.
 */
export const uploadFile = async (file: File, path?: string): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  
  // We use the environment variable, but you can hardcode your ImgBB key here if you prefer
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "e1d67be92abf4886f7b18cbac6cb4f19"; 
  
  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    
    const data = await response.json();
    if (data.success) {
      return data.data.url; // Returns the direct image URL
    } else {
      throw new Error(data.error?.message || "Failed to upload image");
    }
  } catch (error) {
    console.error("ImgBB Upload Error:", error);
    throw error;
  }
};
