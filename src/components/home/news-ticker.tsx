"use client";

import { useEffect, useState, useMemo } from 'react';
import { dynamicContentLoading, DynamicContentLoadingOutput } from '@/ai/flows/dynamic-content-loading';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const fallbackContent = [
  'New STEM curriculum approved for local schools.',
  'Tech giant announces major expansion in the region.',
  'Virtual career fair scheduled for next month.',
  'Learn Python with our new introductory course.',
  'University opens applications for 2025 intake.',
];

export default function NewsTicker() {
  const [content, setContent] = useState<DynamicContentLoadingOutput['relevantContent'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      setIsLoading(true);
      try {
        const result = await dynamicContentLoading({
          userInteractions: 'User is interested in technology, higher education, and software development job market trends.',
          contentType: 'news',
        });
        
        if (result && result.relevantContent && result.relevantContent.length > 0) {
          setContent(result.relevantContent);
        } else {
          throw new Error("AI returned no content.");
        }
      } catch (error) {
        console.error('Failed to load dynamic content, using fallback:', error);
        setContent(fallbackContent);
      } finally {
        setIsLoading(false);
      }
    }
    loadContent();
  }, []);

  const duplicatedContent = useMemo(() => {
    if (!content) return [];
    return [...content, ...content, ...content, ...content];
  }, [content]);

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Live Updates
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Stay ahead with the latest news, announcements, and opportunities curated for you.
        </p>
      </div>

      <div className="relative w-full overflow-hidden group">
        <div className="absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />

        <motion.div 
            className="flex gap-6 py-4 animate-[marquee_60s_linear_infinite] group-hover:[animation-play-state:paused]"
        >
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80 rounded-lg p-4 border border-white/10 bg-white/5 space-y-2">
                <Skeleton className="h-4 w-16 rounded-md" />
                <Skeleton className="h-6 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
              </div>
            ))
          ) : (
            duplicatedContent.map((item, index) => (
              <div key={index} className="flex-shrink-0 w-80 h-36 rounded-2xl p-5 border border-white/10 bg-black/20 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:border-primary/50 hover:bg-primary/10 hover:-translate-y-1">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    {index < (content?.length ?? 0) && (
                       <span className="inline-block px-2.5 py-0.5 text-xs font-semibold text-primary-foreground bg-primary/70 rounded-full animate-[pulse-glow_2s_ease-in-out_infinite]">
                         New
                       </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/80 leading-snug">
                    {item}
                  </p>
                </div>
              </div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
}
