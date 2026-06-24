"use client";

import { useSettings } from "@/hooks/useSettings";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { useRole } from "@/hooks/useRole";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Faq } from "@/lib/types";

export default function FaqAccordion() {
  const { settings } = useSettings();
  const { isManager } = useRole();
  const { setDraft, draftSettings } = useSettingsStore();

  const currentFaqs = draftSettings?.faqs ?? settings?.faqs ?? [];

  const [localFaqs, setLocalFaqs] = useState<Faq[]>(currentFaqs);

  // Sync with store/db when it changes externally
  useEffect(() => {
    setLocalFaqs(currentFaqs);
  }, [currentFaqs]);

  const updateFaq = (index: number, field: keyof Faq, value: string) => {
    const updated = [...localFaqs];
    updated[index] = { ...updated[index], [field]: value };
    setLocalFaqs(updated);
    setDraft({ faqs: updated });
  };

  const addFaq = () => {
    const updated = [...localFaqs, { question: "New Question", answer: "New Answer" }];
    setLocalFaqs(updated);
    setDraft({ faqs: updated });
  };

  const removeFaq = (index: number) => {
    const updated = localFaqs.filter((_, i) => i !== index);
    setLocalFaqs(updated);
    setDraft({ faqs: updated });
  };

  if (!isManager) {
    if (localFaqs.length === 0) return null;
    return (
      <Accordion type="single" collapsible className="w-full">
        {localFaqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left font-serif text-lg">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }

  // Manager View
  return (
    <div className="space-y-6">
      {localFaqs.map((faq, index) => (
        <div key={index} className="bg-card p-4 rounded-xl border relative group">
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute -top-3 -right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => removeFaq(index)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Question</label>
              <Input 
                value={faq.question} 
                onChange={(e) => updateFaq(index, "question", e.target.value)} 
                className="font-serif text-lg"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Answer</label>
              <Textarea 
                value={faq.answer} 
                onChange={(e) => updateFaq(index, "answer", e.target.value)} 
                className="min-h-[80px]"
              />
            </div>
          </div>
        </div>
      ))}
      <Button onClick={addFaq} variant="outline" className="w-full border-dashed">
        <Plus className="w-4 h-4 mr-2" />
        Add FAQ
      </Button>
    </div>
  );
}
