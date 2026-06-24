"use client";

import { useState, useRef, useEffect } from "react";
import { useRole } from "@/hooks/useRole";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";

interface InlineEditProps {
  value: string;
  settingKey: string;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
}

export function InlineEdit({ value, settingKey, multiline = false, className, placeholder }: InlineEditProps) {
  const { isManager } = useRole();
  const { setDraft, draftSettings } = useSettingsStore();
  
  const currentValue = draftSettings?.[settingKey as keyof typeof draftSettings] !== undefined 
    ? draftSettings[settingKey as keyof typeof draftSettings] 
    : value;

  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(currentValue as string);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(currentValue as string);
  }, [currentValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      setDraft({ [settingKey]: localValue });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      handleBlur();
    }
    if (e.key === "Escape") {
      setLocalValue(currentValue as string);
      setIsEditing(false);
    }
  };

  if (!isManager) {
    return <span className={className}>{currentValue as React.ReactNode}</span>;
  }

  if (isEditing) {
    return multiline ? (
      <Textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn("bg-background min-h-[100px]", className)}
        placeholder={placeholder}
      />
    ) : (
      <Input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn("bg-background h-auto py-1", className)}
        placeholder={placeholder}
      />
    );
  }

  return (
    <div 
      className={cn("group relative inline-flex items-center cursor-text hover:bg-accent/10 rounded px-1 -ml-1 transition-colors", className)}
      onClick={() => setIsEditing(true)}
    >
      <span>{currentValue as React.ReactNode || <span className="text-muted-foreground italic">Empty</span>}</span>
      <Pencil className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
    </div>
  );
}
