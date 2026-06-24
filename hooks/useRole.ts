"use client";

import { useAuth } from "@/contexts/AuthContext";

export const useRole = () => {
  const { user, userDoc, loading } = useAuth();

  const isManager = userDoc?.role === "manager";
  const isUser = userDoc?.role === "user" || !!user;

  return {
    user,
    userDoc,
    isManager,
    isUser,
    loading,
  };
};
