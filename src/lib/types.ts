import type { Timestamp } from 'firebase/firestore';

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  author: string;
  publicationDate: Timestamp | string; // Allow string for initial data, but prefer Timestamp
  imageUrl: string;
  category: string;
  status: 'New' | 'Urgent' | 'Standard';
}
