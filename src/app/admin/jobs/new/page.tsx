'use client';

import JobPostingForm from '@/components/admin/job-posting-form';

export default function NewJobPostingPage() {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="font-headline text-2xl font-bold mb-6">Create New Job Posting</h1>
      <JobPostingForm />
    </div>
  );
}
