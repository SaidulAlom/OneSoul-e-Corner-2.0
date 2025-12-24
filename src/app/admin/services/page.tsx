'use client';

import Link from 'next/link';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { ProfessionalService } from '@/lib/types';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '@/components/ui/skeleton';

function ServicesTable({ services }: { services: ProfessionalService[] }) {
  const firestore = useFirestore();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      const serviceRef = doc(firestore, 'services', id);
      deleteDocumentNonBlocking(serviceRef);
    }
  };

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
                <TableHead className="w-16">Icon</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Subtitle</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => {
              const Icon = (LucideIcons as any)[service.icon] || LucideIcons.Briefcase;
              return (
              <TableRow key={service.id}>
                <TableCell><Icon className="h-5 w-5 text-muted-foreground" /></TableCell>
                <TableCell className="font-medium">{service.title}</TableCell>
                <TableCell>{service.subtitle}</TableCell>
                <TableCell className="text-right">₹{service.startingPrice}</TableCell>
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
                        <Link href={`/admin/services/edit/${service.id}`}>Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(service.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-{services.length}</strong> of <strong>{services.length}</strong> services
        </div>
      </CardFooter>
    </Card>
  );
}

function ServicesTableSkeleton() {
    return (
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Icon</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Subtitle</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-5 rounded-sm" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
}

export default function AdminServicesPage() {
  const firestore = useFirestore();

  const servicesCollectionQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'services'), orderBy('title'));
  }, [firestore]);

  const { data: services, isLoading } = useCollection<ProfessionalService>(servicesCollectionQuery);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 sm:p-6">
      <main className="grid flex-1 items-start gap-4">
        <div className="flex items-center">
          <h1 className="font-headline text-2xl font-bold">Services</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" asChild className="h-7 gap-1">
              <Link href="/admin/services/new">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Service
                </span>
              </Link>
            </Button>
          </div>
        </div>
        {isLoading && <ServicesTableSkeleton />}
        {services && <ServicesTable services={services} />}
        {services?.length === 0 && !isLoading && (
          <Card>
            <CardHeader>
              <CardTitle>No Services Found</CardTitle>
              <CardDescription>
                There are no services yet. Get started by creating one.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/admin/services/new">Create New Service</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
