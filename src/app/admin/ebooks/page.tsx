'use client';

import Link from 'next/link';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { EBook } from '@/lib/types';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

function EBooksTable({ ebooks }: { ebooks: EBook[] }) {
  const firestore = useFirestore();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this e-book?')) {
      const ebookRef = doc(firestore, 'ebooks', id);
      deleteDocumentNonBlocking(ebookRef);
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
              <TableHead>Author</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ebooks.map((ebook) => (
              <TableRow key={ebook.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={ebook.title}
                    className="aspect-[2/3] rounded-md object-cover"
                    height="96"
                    src={ebook.coverImageUrl}
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium">{ebook.title}</TableCell>
                <TableCell>{ebook.author}</TableCell>
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
                        <Link href={`/admin/ebooks/edit/${ebook.id}`}>Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(ebook.id)}>
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
          Showing <strong>1-{ebooks.length}</strong> of <strong>{ebooks.length}</strong> e-books
        </div>
      </CardFooter>
    </Card>
  );
}

function EBooksTableSkeleton() {
    return (
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell"><span className="sr-only">Image</span></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="hidden sm:table-cell"><Skeleton className="h-24 w-16 rounded-md" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

export default function AdminEBooksPage() {
  const firestore = useFirestore();

  const ebooksCollectionQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'ebooks'), orderBy('title'));
  }, [firestore]);

  const { data: ebooks, isLoading } = useCollection<EBook>(ebooksCollectionQuery);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 sm:p-6">
      <main className="grid flex-1 items-start gap-4">
        <div className="flex items-center">
          <h1 className="font-headline text-2xl font-bold">E-Books</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" asChild className="h-7 gap-1">
              <Link href="/admin/ebooks/new">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add E-Book
                </span>
              </Link>
            </Button>
          </div>
        </div>
        {isLoading && <EBooksTableSkeleton />}
        {ebooks && <EBooksTable ebooks={ebooks} />}
        {ebooks?.length === 0 && !isLoading && (
          <Card>
            <CardHeader>
              <CardTitle>No E-Books Found</CardTitle>
              <CardDescription>
                There are no e-books yet. Get started by creating one.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/admin/ebooks/new">Create New E-Book</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
