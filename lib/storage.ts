import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export { storage, ref, uploadBytes, getDownloadURL, deleteObject };

/**
 * Uploads a file to ImgBB (Free Image Hosting) and returns the download URL.
 * Securely retrieves API key from NEXT_PUBLIC_IMGBB_API_KEY environment variable.
 */
export const uploadFile = async (file: File, path?: string): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);
  
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY; 
  if (!apiKey) {
    console.warn("NEXT_PUBLIC_IMGBB_API_KEY is not defined. Falling back to local data URL.");
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    
    const data = await response.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || "Failed to upload image");
    }
  } catch (error) {
    console.error("ImgBB Upload Error:", error);
    throw error;
  }
};
