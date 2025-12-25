'use server';

import { db } from '@/firebase/admin';
import { NewsArticle } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function createNewsArticle(articleData: any) {
  try {
    await db.collection('news').add({
      ...articleData,
      publishedAt: new Date().toISOString(),
    });
    revalidatePath('/admin/news');
    revalidatePath('/news');
    return { success: true };
  } catch (error) {
    console.error('Error creating article:', error);
    return { success: false, error: 'Failed to create article' };
  }
}

export async function getNewsArticles() {
  try {
    const snapshot = await db.collection('news').orderBy('publishedAt', 'desc').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}