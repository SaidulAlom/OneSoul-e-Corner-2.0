import { db } from '@/firebase/admin';
import { NewsArticle } from '@/lib/types';

export async function getNewsArticles(): Promise<NewsArticle[]> {
  try {
    const snapshot = await db.collection('news').orderBy('publishedAt', 'desc').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as NewsArticle));
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}
