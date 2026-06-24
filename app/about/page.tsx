import AboutContent from "@/components/about/AboutContent";
import FaqAccordion from "@/components/about/FaqAccordion";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">Our Story</h1>
        <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Decorative Image Side */}
        <div className="relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-muted">
            {/* Using a placeholder aesthetic color if no image, or user can add one later */}
            <div className="w-full h-full bg-secondary/30 flex items-center justify-center text-muted-foreground p-8 text-center">
              <span className="font-serif italic text-2xl opacity-50">"Stitching memories with every yarn."</span>
            </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/20 rounded-full blur-2xl -z-10"></div>
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/20 rounded-full blur-xl -z-10"></div>
        </div>

        {/* Content Side */}
        <div className="flex flex-col justify-center">
          <AboutContent />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-foreground">Frequently Asked Questions</h2>
        </div>
        <FaqAccordion />
      </div>

    </div>
  );
}
