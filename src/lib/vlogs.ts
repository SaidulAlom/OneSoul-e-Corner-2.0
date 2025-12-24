
import { db } from '@/firebase/admin';
import { cache } from 'react';
import { Vlog } from './types';

export const getVlogs = cache(async () => {
  const snapshot = await db.collection('vlogs').get();
  
  const vlogs: Vlog[] = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Vlog));
  
  return vlogs;
});
