'use client';

import Link from 'next/link';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import {
  collection,
  query,
  orderBy,
  doc
} from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { JobPosting } from '@/lib/types';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '@/components/ui/skeleton';

function JobsTable({ jobs }: { jobs: JobPosting[] }) {
  const firestore = useFirestore();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this job posting?')) {
        const jobRef = doc(firestore, 'job_postings', id);
        deleteDocumentNonBlocking(jobRef);
    }
  };

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {job.location}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/jobs/${job.id}`}>View</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/jobs/edit/${job.id}`}>Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(job.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-{jobs.length}</strong> of <strong>{jobs.length}</strong> jobs
        </div>
      </CardFooter>
    </Card>
  );
}

function JobsTableSkeleton() {
    return (
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
}

export default function AdminJobsPage() {
    const firestore = useFirestore();

    const jobsCollectionQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'job_postings'), orderBy('postedDate', 'desc'));
    }, [firestore]);

    const { data: jobs, isLoading } = useCollection<JobPosting>(jobsCollectionQuery);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 sm:p-6">
      <main className="grid flex-1 items-start gap-4">
        <div className="flex items-center">
            <h1 className="font-headline text-2xl font-bold">Job Postings</h1>
            <div className="ml-auto flex items-center gap-2">
              <Button size="sm" asChild className="h-7 gap-1">
                <Link href="/admin/jobs/new">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Job
                  </span>
                </Link>
              </Button>
            </div>
        </div>
        {isLoading && <JobsTableSkeleton />}
        {jobs && <JobsTable jobs={jobs} />}
        {jobs?.length === 0 && !isLoading && (
             <Card>
                <CardHeader>
                    <CardTitle>No Job Postings Found</CardTitle>
                    <CardDescription>
                        There are no jobs yet. Get started by creating one.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                         <Link href="/admin/jobs/new">Create New Job</Link>
                    </Button>
                </CardContent>
            </Card>
        )}
      </main>
    </div>
  );
}
