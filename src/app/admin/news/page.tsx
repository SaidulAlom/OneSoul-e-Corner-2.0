'use client';

import Link from 'next/link';
import { PlusCircle, MoreHorizontal, File, ListFilter } from 'lucide-react';
import {
  collection,
  query,
  orderBy,
} from 'firebase/firestore';

import { Badge } from '@/components/ui/badge';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { NewsArticle } from '@/lib/types';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

function NewsTable({ articles }: { articles: NewsArticle[] }) {
  const firestore = useFirestore();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
        const articleRef = doc(firestore, 'news_articles', id);
        deleteDocumentNonBlocking(articleRef);
    }
  };

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">
                Published
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge variant="outline">{article.status}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {article.category}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(article.publicationDate).toLocaleDateString()}
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
                        <Link href={`/admin/news/edit/${article.id}`}>Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(article.id)}>
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
          Showing <strong>1-{articles.length}</strong> of <strong>{articles.length}</strong> articles
        </div>
      </CardFooter>
    </Card>
  );
}


function NewsTableSkeleton() {
    return (
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">
                  Published
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
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

export default function AdminNewsPage() {
    const firestore = useFirestore();

    const newsCollectionQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'news_articles'), orderBy('publicationDate', 'desc'));
    }, [firestore]);

    const { data: articles, isLoading } = useCollection<NewsArticle>(newsCollectionQuery);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 sm:p-6">
      <main className="grid flex-1 items-start gap-4">
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="urgent">Urgent</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filter
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuItem>Status</DropdownMenuItem>
                    <DropdownMenuItem>Category</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="outline" className="h-7 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
              <Button size="sm" asChild className="h-7 gap-1">
                <Link href="/admin/news/new">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Article
                  </span>
                </Link>
              </Button>
            </div>
          </div>
          <TabsContent value="all">
            {isLoading && <NewsTableSkeleton />}
            {articles && <NewsTable articles={articles} />}
            {articles?.length === 0 && !isLoading && (
                 <Card>
                    <CardHeader>
                        <CardTitle>No Articles Found</CardTitle>
                        <CardDescription>
                            There are no news articles yet. Get started by creating one.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                             <Link href="/admin/news/new">Create New Article</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
