"use client";

import { useSettingsContext } from "@/contexts/SettingsContext";

export const useSettings = () => {
  const { settings, loading } = useSettingsContext();
  return { settings, loading };
};
