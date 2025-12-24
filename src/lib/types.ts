import type { Timestamp } from 'firebase/firestore';

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  author: string;
  publicationDate: Timestamp | string;
  imageUrl: string;
  category: string;
  status: 'New' | 'Urgent' | 'Standard';
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  postedDate: Timestamp | string;
}

export interface Vlog {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    publishedDate: Timestamp | string;
}

export interface EBook {
    id: string;
    title: string;
    author: string;
    description: string;
    coverImageUrl: string;
    downloadUrl: string;
}

export interface ProfessionalService {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    icon: string; // Storing icon name from lucide-react
    startingPrice: number;
}
