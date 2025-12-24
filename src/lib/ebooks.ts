
import { db } from '@/firebase/admin';
import { cache } from 'react';
import { EBook } from './types';

export const getEBooks = cache(async () => {
  const snapshot = await db.collection('ebooks').get();
  
  const ebooks: EBook[] = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as EBook));
  
  return ebooks;
});
