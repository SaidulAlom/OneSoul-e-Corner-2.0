'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import ServiceForm from '@/components/admin/service-form';
import type { ProfessionalService } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditServicePage() {
  const { id } = useParams();
  const firestore = useFirestore();
  const serviceId = Array.isArray(id) ? id[0] : id;

  const serviceRef = useMemoFirebase(() => {
    if (!firestore || !serviceId) return null;
    return doc(firestore, 'services', serviceId);
  }, [firestore, serviceId]);

  const { data: service, isLoading } = useDoc<ProfessionalService>(serviceRef);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 space-y-6">
        <Skeleton className="h-8 w-1/4" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="font-headline text-2xl font-bold mb-6">Edit Service</h1>
      {service ? (
        <ServiceForm service={service} />
      ) : (
        <p>Service not found.</p>
      )}
    </div>
  );
}
