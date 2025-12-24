'use client';

import Link from 'next/link';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Vlog } from '@/lib/types';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

function VlogsTable({ vlogs }: { vlogs: Vlog[] }) {
  const firestore = useFirestore();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this vlog?')) {
      const vlogRef = doc(firestore, 'vlogs', id);
      deleteDocumentNonBlocking(vlogRef);
    }
  };

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vlogs.map((vlog) => (
              <TableRow key={vlog.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={vlog.title}
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={vlog.thumbnailUrl}
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium">{vlog.title}</TableCell>
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
                        <Link href={`/admin/vlogs/edit/${vlog.id}`}>Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(vlog.id)}>
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
          Showing <strong>1-{vlogs.length}</strong> of <strong>{vlogs.length}</strong> vlogs
        </div>
      </CardFooter>
    </Card>
  );
}

function VlogsTableSkeleton() {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell"><span className="sr-only">Image</span></TableHead>
              <TableHead>Title</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="hidden sm:table-cell"><Skeleton className="h-16 w-16 rounded-md" /></TableCell>
                <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function AdminVlogsPage() {
  const firestore = useFirestore();

  const vlogsCollectionQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'vlogs'), orderBy('publishedDate', 'desc'));
  }, [firestore]);

  const { data: vlogs, isLoading } = useCollection<Vlog>(vlogsCollectionQuery);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 sm:p-6">
      <main className="grid flex-1 items-start gap-4">
        <div className="flex items-center">
          <h1 className="font-headline text-2xl font-bold">Vlogs</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" asChild className="h-7 gap-1">
              <Link href="/admin/vlogs/new">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Vlog
                </span>
              </Link>
            </Button>
          </div>
        </div>
        {isLoading && <VlogsTableSkeleton />}
        {vlogs && <VlogsTable vlogs={vlogs} />}
        {vlogs?.length === 0 && !isLoading && (
          <Card>
            <CardHeader>
              <CardTitle>No Vlogs Found</CardTitle>
              <CardDescription>
                There are no vlogs yet. Get started by creating one.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/admin/vlogs/new">Create New Vlog</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
