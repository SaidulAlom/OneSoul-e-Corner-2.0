
import { db } from '@/firebase/admin';
import { cache } from 'react';
import { JobPosting } from './types';

export const getJobPostings = cache(async () => {
  const snapshot = await db.collection('jobs').get();
  
  const jobs: JobPosting[] = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as JobPosting));
  
  return jobs;
});
