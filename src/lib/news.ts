
import { db } from '@/firebase/admin';
import { cache } from 'react';
import { NewsArticle } from './types';

export const getNewsArticles = cache(async () => {
  const snapshot = await db.collection('news').get();
  
  const articles: NewsArticle[] = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as NewsArticle));
  
  return articles;
});
