
import { db } from '@/firebase/admin';
import { cache } from 'react';
import { Service } from './types';

export const getServices = cache(async () => {
  const snapshot = await db.collection('services').get();
  
  const services: Service[] = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Service));
  
  return services;
});
