'use client';

import { Briefcase } from 'lucide-react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useMemo, useEffect } from 'react';
import Link from 'next/link';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { JobPosting } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { stripHtml } from '@/lib/utils';

function JobPostingItem({ job }: { job: JobPosting }) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="bg-secondary/30 border border-white/10 backdrop-blur-md shadow-lg hover:border-primary/50 transition-colors duration-300 cursor-pointer">
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                {job.title}
              </CardTitle>
              <div className="text-sm text-muted-foreground mt-1">
                  <span>{job.company}</span> &middot; <span>{job.location}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground line-clamp-3">
              {(() => {
                const plainText = stripHtml(job.description);
                return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
              })()}
            </p>
          </CardContent>
        </Card>
    </Link>
  );
}

function JobsListSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="bg-secondary/30 border border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-start gap-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function JobsList() {
  const firestore = useFirestore();

  const jobsCollectionQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'job_postings'), orderBy('postedDate', 'desc'));
  }, [firestore]);

  const { data: jobs, isLoading, error } = useCollection<JobPosting>(jobsCollectionQuery);

  // Debug logging
  useEffect(() => {
    if (jobs) {
      console.log('Jobs loaded:', jobs.length, jobs);
    }
    if (error) {
      console.error('Jobs error:', error);
    }
  }, [jobs, error]);

  if (isLoading) {
    return <JobsListSkeleton />;
  }

  if (error) {
    console.error('Error fetching jobs:', error);
    return (
      <div className="text-center py-10 px-4 bg-destructive/10 rounded-lg border border-destructive/20">
        <Briefcase className="mx-auto h-12 w-12 text-destructive" />
        <h3 className="mt-4 text-xl font-semibold text-destructive">Error Loading Jobs</h3>
        <p className="text-muted-foreground mt-2">
          {error.message || 'Failed to load job postings. Please try refreshing the page.'}
        </p>
        {error.message?.includes('index') && (
          <p className="text-sm text-muted-foreground mt-2">
            A Firestore index may need to be created. Check the browser console for the index link.
          </p>
        )}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-secondary/20 rounded-lg">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-xl font-semibold">No Jobs Posted... Yet!</h3>
        <p className="text-muted-foreground mt-2">Check back soon for new opportunities.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {jobs.map((job) => (
        <JobPostingItem key={job.id} job={job} />
      ))}
    </div>
  );
}
