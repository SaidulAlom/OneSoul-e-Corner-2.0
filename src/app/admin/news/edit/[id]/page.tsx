'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import NewsArticleForm from '@/components/admin/news-article-form';
import type { NewsArticle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditNewsArticlePage() {
  const { id } = useParams();
  const firestore = useFirestore();
  const articleId = Array.isArray(id) ? id[0] : id;

  const articleRef = useMemoFirebase(() => {
    if (!firestore || !articleId) return null;
    return doc(firestore, 'news_articles', articleId);
  }, [firestore, articleId]);

  const { data: article, isLoading } = useDoc<NewsArticle>(articleRef);

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
          <Skeleton className="h-10 w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="font-headline text-2xl font-bold mb-6">Edit News Article</h1>
      {article ? (
        <NewsArticleForm article={article} />
      ) : (
        <p>Article not found.</p>
      )}
    </div>
  );
}
