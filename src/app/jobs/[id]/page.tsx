'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, Timestamp } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import type { JobPosting } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, Building2, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const formatPostedDate = (postedDate: any) => {
    if (!postedDate) return 'Date not available';
    const date = postedDate instanceof Timestamp ? postedDate.toDate() : new Date(postedDate);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export default function JobPostingPage() {
  const { id } = useParams();
  const firestore = useFirestore();
  const jobId = Array.isArray(id) ? id[0] : id;

  const jobRef = useMemoFirebase(() => {
    if (!firestore || !jobId) return null;
    return doc(firestore, 'job_postings', jobId);
  }, [firestore, jobId]);

  const { data: job, isLoading, error } = useDoc<JobPosting>(jobRef);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto max-w-3xl px-4">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
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
          <h1 className="text-4xl font-bold">Error Loading Job</h1>
          <p className="text-muted-foreground mt-2">
            {error.message || 'An error occurred while loading the job posting.'}
          </p>
          <Link href="/jobs" className="mt-6 inline-block text-primary hover:underline">
            &larr; Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center text-center">
        <div>
          <h1 className="text-4xl font-bold">Job Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The job posting you are looking for does not exist.
          </p>
          <Link href="/jobs" className="mt-6 inline-block text-primary hover:underline">
            &larr; Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-3xl px-4">
        <article>
          <header className="mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-4 rounded-xl bg-primary/20 border border-primary/30 flex-shrink-0">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{job.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={job.postedDate.toString()}>{formatPostedDate(job.postedDate)}</time>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="bg-secondary/30 border border-white/10 rounded-2xl p-8 mb-8 backdrop-blur-md">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">Job Description</h2>
            <div 
              className="prose prose-invert lg:prose-lg max-w-none text-foreground/90 prose-p:leading-relaxed prose-headings:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground prose-blockquote:text-foreground"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>

          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/submit-job">
                Apply for This Position
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="/jobs">
                &larr; Back to Jobs
              </Link>
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
}

