import { create } from 'zustand';
import { SiteSettings } from '@/lib/types';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface SettingsStoreState {
  draftSettings: Partial<SiteSettings> | null;
  hasUnsavedChanges: boolean;
  setDraft: (newSettings: Partial<SiteSettings>) => void;
  saveAll: () => Promise<void>;
  discard: () => void;
}

export const useSettingsStore = create<SettingsStoreState>((set, get) => ({
  draftSettings: null,
  hasUnsavedChanges: false,
  
  setDraft: (newSettings) => {
    set((state) => ({
      draftSettings: { ...state.draftSettings, ...newSettings },
      hasUnsavedChanges: true,
    }));
  },
  
  saveAll: async () => {
    const { draftSettings } = get();
    if (!draftSettings) return;
    
    // Save to Firestore
    const docRef = doc(db, 'siteSettings', 'config');
    await setDoc(docRef, draftSettings, { merge: true });
    
    // Clear draft state
    set({ draftSettings: null, hasUnsavedChanges: false });
  },
  
  discard: () => {
    set({ draftSettings: null, hasUnsavedChanges: false });
  }
}));
