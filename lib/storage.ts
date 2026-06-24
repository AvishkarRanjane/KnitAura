import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export { storage, ref, uploadBytes, getDownloadURL, deleteObject };

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};
