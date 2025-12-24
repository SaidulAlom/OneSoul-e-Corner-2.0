'use client';

import NewsArticleForm from '@/components/admin/news-article-form';

export default function NewNewsArticlePage() {
  return (
    <div className="p-4 sm:p-6">
      <h1 className="font-headline text-2xl font-bold mb-6">Create New Article</h1>
      <NewsArticleForm />
    </div>
  );
}
