'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import VlogForm from '@/components/admin/vlog-form';
import type { Vlog } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditVlogPage() {
  const { id } = useParams();
  const firestore = useFirestore();
  const vlogId = Array.isArray(id) ? id[0] : id;

  const vlogRef = useMemoFirebase(() => {
    if (!firestore || !vlogId) return null;
    return doc(firestore, 'vlogs', vlogId);
  }, [firestore, vlogId]);

  const { data: vlog, isLoading } = useDoc<Vlog>(vlogRef);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <div className="space-y-4">
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
      <h1 className="font-headline text-2xl font-bold mb-6">Edit Vlog</h1>
      {vlog ? (
        <VlogForm vlog={vlog} />
      ) : (
        <p>Vlog not found.</p>
      )}
    </div>
  );
}
