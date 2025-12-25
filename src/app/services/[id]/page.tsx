'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import type { ProfessionalService } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Settings } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import * as LucideIcons from 'lucide-react';

export default function ServiceDetailPage() {
  const { id } = useParams();
  const firestore = useFirestore();
  const serviceId = Array.isArray(id) ? id[0] : id;

  const serviceRef = useMemoFirebase(() => {
    if (!firestore || !serviceId) return null;
    return doc(firestore, 'services', serviceId);
  }, [firestore, serviceId]);

  const { data: service, isLoading, error } = useDoc<ProfessionalService>(serviceRef);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto max-w-3xl px-4">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
            </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center text-center">
        <div>
          <h1 className="text-4xl font-bold">Error Loading Service</h1>
          <p className="text-muted-foreground mt-2">
            {error.message || 'An error occurred while loading the service.'}
          </p>
          <Link href="/services" className="mt-6 inline-block text-primary hover:underline">
            &larr; Back to Services
          </Link>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center text-center">
        <div>
          <h1 className="text-4xl font-bold">Service Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The service you are looking for does not exist.
          </p>
          <Link href="/services" className="mt-6 inline-block text-primary hover:underline">
            &larr; Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const Icon = (LucideIcons as any)[service.icon] || Settings;

  return (
    <div className="min-h-screen pt-32 pb-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-3xl px-4">
        <article>
          <header className="mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-4 rounded-xl bg-primary/20 border border-primary/30 flex-shrink-0">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-2">
                  {service.title}
                </h1>
                <p className="text-lg text-muted-foreground">{service.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300">
                Starting at ₹{service.startingPrice}
              </div>
            </div>
          </header>

          {/* Description */}
          {service.description && (
            <div className="bg-secondary/30 border border-white/10 rounded-2xl p-8 mb-8 backdrop-blur-md">
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Service Description</h2>
              <div 
                className="prose prose-invert lg:prose-lg max-w-none text-foreground/90 prose-p:leading-relaxed prose-headings:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground prose-blockquote:text-foreground"
                dangerouslySetInnerHTML={{ __html: service.description }}
              />
            </div>
          )}

          {/* Services Included */}
          {service.features && service.features.length > 0 && (
            <div className="bg-secondary/30 border border-white/10 rounded-2xl p-8 mb-8 backdrop-blur-md">
              <div className="flex items-center gap-2 mb-4">
                <Check className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">Services Included</h2>
              </div>
              <ul className="space-y-2 text-foreground/90">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-3 mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button 
              asChild
              size="lg" 
              className="rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold"
            >
              <Link href="/contact">
                Apply Now
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="/services">
                &larr; Back to Services
              </Link>
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
}

