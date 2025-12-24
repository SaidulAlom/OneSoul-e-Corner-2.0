'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import EBookForm from '@/components/admin/ebook-form';
import type { EBook } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditEBookPage() {
  const { id } = useParams();
  const firestore = useFirestore();
  const ebookId = Array.isArray(id) ? id[0] : id;

  const ebookRef = useMemoFirebase(() => {
    if (!firestore || !ebookId) return null;
    return doc(firestore, 'ebooks', ebookId);
  }, [firestore, ebookId]);

  const { data: ebook, isLoading } = useDoc<EBook>(ebookRef);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="font-headline text-2xl font-bold mb-6">Edit E-Book</h1>
      {ebook ? (
        <EBookForm ebook={ebook} />
      ) : (
        <p>E-Book not found.</p>
      )}
    </div>
  );
}
