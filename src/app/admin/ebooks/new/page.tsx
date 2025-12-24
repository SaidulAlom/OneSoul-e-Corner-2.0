'use client';

import EBookForm from '@/components/admin/ebook-form';

export default function NewEBookPage() {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="font-headline text-2xl font-bold mb-6">Create New E-Book</h1>
      <EBookForm />
    </div>
  );
}
