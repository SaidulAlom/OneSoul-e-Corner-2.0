'use client';

import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import AdminNewsPageContent from './admin-news-page-content';
import type { NewsArticle } from '@/lib/types';

export default function AdminNewsPage() {
  const firestore = useFirestore();

  const newsArticlesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'news_articles'), orderBy('publicationDate', 'desc'));
  }, [firestore]);

  const { data: articles, isLoading, error } = useCollection<NewsArticle>(newsArticlesQuery);

  if (error) {
    console.error('Error fetching news articles in admin:', error);
  }

  return <AdminNewsPageContent articles={articles || []} isLoading={isLoading} />;
}
