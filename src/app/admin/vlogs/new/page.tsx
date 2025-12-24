'use client';

import VlogForm from '@/components/admin/vlog-form';

export default function NewVlogPage() {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="font-headline text-2xl font-bold mb-6">Create New Vlog</h1>
      <VlogForm />
    </div>
  );
}
