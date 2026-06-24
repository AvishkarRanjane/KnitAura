"use client";

import { useRole } from "@/hooks/useRole";
import { Badge } from "@/components/ui/badge";

export default function ManagerBadge() {
  const { isManager } = useRole();

  if (!isManager) return null;

  return (
    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 pointer-events-none">
      Manager View
    </Badge>
  );
}
