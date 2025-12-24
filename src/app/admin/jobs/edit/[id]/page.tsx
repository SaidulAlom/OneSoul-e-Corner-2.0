'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import JobPostingForm from '@/components/admin/job-posting-form';
import type { JobPosting } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditJobPostingPage() {
  const { id } = useParams();
  const firestore = useFirestore();
  const jobId = Array.isArray(id) ? id[0] : id;

  const jobRef = useMemoFirebase(() => {
    if (!firestore || !jobId) return null;
    return doc(firestore, 'job_postings', jobId);
  }, [firestore, jobId]);

  const { data: job, isLoading } = useDoc<JobPosting>(jobRef);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="font-headline text-2xl font-bold mb-6">Edit Job Posting</h1>
      {job ? (
        <JobPostingForm job={job} />
      ) : (
        <p>Job Posting not found.</p>
      )}
    </div>
  );
}
