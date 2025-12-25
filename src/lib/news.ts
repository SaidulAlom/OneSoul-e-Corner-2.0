import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { NewsArticle } from '@/lib/types';

export async function getNewsArticles(): Promise<NewsArticle[]> {
  try {
    const { firestore } = initializeFirebase();
    const q = query(collection(firestore, 'news'), orderBy('publishedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as NewsArticle));
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}
