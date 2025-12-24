'use client';

import {
  collection,
  query,
  orderBy,
} from 'firebase/firestore';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { EBook } from '@/lib/types';
import Image from 'next/image';
import { Button } from '../ui/button';

function EBookItem({
  ebook,
  index,
}: {
  ebook: EBook;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="bg-secondary/30 border border-white/10 backdrop-blur-md shadow-lg hover:border-primary/50 transition-colors duration-300 flex flex-col sm:flex-row gap-6 p-6">
        <div className="relative w-32 h-48 flex-shrink-0 mx-auto sm:mx-0">
            <Image src={ebook.coverImageUrl} alt={ebook.title} fill className="object-cover rounded-md"/>
        </div>
        <div className="flex-1 flex flex-col">
            <CardHeader className="p-0">
                <CardTitle className="text-lg font-semibold text-foreground">
                {ebook.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{ebook.author}</p>
            </CardHeader>
            <CardContent className="p-0 mt-2 flex-grow">
                <p className="text-muted-foreground line-clamp-3">{ebook.description}</p>
            </CardContent>
            <div className="mt-4">
                <Button asChild>
                    <a href={ebook.downloadUrl} target="_blank" rel="noopener noreferrer">Download</a>
                </Button>
            </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function EBooksList() {
  const firestore = useFirestore();

  const ebooksCollectionQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'ebooks'));
  }, [firestore]);

  const {
    data: ebooks,
    isLoading,
    error,
  } = useCollection<EBook>(ebooksCollectionQuery);

  if (error) {
    return (
      <div className="text-center py-10 px-4">
        <p className="text-destructive">
          Error loading e-books: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isLoading &&
        Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="flex gap-6 p-6 bg-secondary/20 border-white/10">
                <Skeleton className="w-32 h-48 rounded-md flex-shrink-0" />
                <div className="flex-1 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                    <Skeleton className="h-10 w-24" />
                </div>
            </Card>
          ))}

      {!isLoading &&
        ebooks?.map((ebook, index) => (
          <EBookItem key={ebook.id} ebook={ebook} index={index} />
        ))}
      
      {!isLoading && ebooks?.length === 0 && (
        <div className="text-center py-10 px-4 bg-secondary/20 rounded-lg">
            <h3 className="text-xl font-semibold">No E-Books Available... Yet!</h3>
            <p className="text-muted-foreground mt-2">Check back soon for new reading material.</p>
        </div>
      )}
    </div>
  );
}
