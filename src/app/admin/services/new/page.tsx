'use client';

import ServiceForm from '@/components/admin/service-form';

export default function NewServicePage() {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="font-headline text-2xl font-bold mb-6">Create New Service</h1>
      <ServiceForm />
    </div>
  );
}
