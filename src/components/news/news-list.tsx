'use client';

import {
  collection,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { motion } from 'framer-motion';
import { ArrowRight, Newspaper } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import Image from 'next/image';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { NewsArticle } from '@/lib/types';
import { Button } from '../ui/button';

// Helper to convert Firestore Timestamp to a readable string or Date
const formatPublicationDate = (publicationDate: any) => {
  if (!publicationDate) return '';
  if (publicationDate instanceof Timestamp) {
    return publicationDate.toDate().toLocaleDateString();
  }
  // Fallback for string dates (from old mock data structure)
  return new Date(publicationDate).toLocaleDateString();
};

function NewsArticleItem({
  article,
  index,
}: {
  article: NewsArticle;
  index: number;
}) {
  // Fallback for invalid image URLs in existing data
  let imageUrl = article.imageUrl;
  const invalidUrl = 'https://share.google/NAhSwqWsCY9tHvMmR';
  if (imageUrl === invalidUrl || !imageUrl) {
    // Generate a consistent placeholder based on the article ID
    const seed = article.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    imageUrl = `https://picsum.photos/seed/${seed}/640/360`;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="bg-secondary/30 border border-white/10 backdrop-blur-md shadow-lg hover:border-primary/50 transition-colors duration-300 flex flex-col sm:flex-row gap-6 p-6">
        <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
          <Image
            src={imageUrl}
            alt={article.title}
            fill
            className="object-cover rounded-md"
          />
        </div>
        <div className="flex-1 flex flex-col">
            <CardHeader className="p-0">
                <p className="text-sm text-muted-foreground mb-1">
                  <span>{article.category}</span> &middot;{' '}
                  <span>{formatPublicationDate(article.publicationDate)}</span>
                </p>
                <CardTitle className="text-xl font-semibold text-foreground leading-tight">
                    <Link href={`/news/${article.id}`} className="hover:text-primary transition-colors">
                        {article.title}
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-3 flex-grow">
                <p className="text-muted-foreground line-clamp-3">{article.content}</p>
            </CardContent>
            <CardFooter className="p-0 mt-4">
                <Button asChild variant="link" className="p-0 h-auto text-primary hover:text-accent">
                    <Link href={`/news/${article.id}`}>
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
}

export default function NewsList() {
  const firestore = useFirestore();

  const newsCollectionQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'news_articles'),
      orderBy('publicationDate', 'desc')
    );
  }, [firestore]);

  const {
    data: articles,
    isLoading,
    error,
  } = useCollection<NewsArticle>(newsCollectionQuery);

  if (error) {
    return (
      <div className="text-center py-10 px-4">
        <p className="text-destructive">
          Error loading news: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {isLoading &&
        Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="flex flex-col sm:flex-row gap-6 p-6 bg-secondary/20 border-white/10">
              <Skeleton className="w-full sm:w-48 h-48 sm:h-auto rounded-md flex-shrink-0" />
              <div className="flex-1 space-y-4">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-6 w-full" />
                  <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                  </div>
                  <Skeleton className="h-6 w-28" />
              </div>
          </Card>
        ))}

      {!isLoading &&
        articles?.map((article, index) => (
          <NewsArticleItem key={article.id} article={article} index={index} />
        ))}
      
      {!isLoading && articles?.length === 0 && (
        <div className="text-center py-10 px-4 bg-secondary/20 rounded-lg">
            <Newspaper className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">No News... Yet!</h3>
            <p className="text-muted-foreground mt-2">Check back soon for the latest updates.</p>
        </div>
      )}
    </div>
  );
}
