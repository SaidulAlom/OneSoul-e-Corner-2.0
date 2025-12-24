'use client';

import {
  collection,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { NewsArticle } from '@/lib/types';

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="bg-secondary/30 border border-white/10 backdrop-blur-md shadow-lg hover:border-primary/50 transition-colors duration-300">
        <CardHeader className="flex flex-row items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
            <Newspaper className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              {article.title}
            </CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              <span>{article.author}</span> &middot;{' '}
              <span>{formatPublicationDate(article.publicationDate)}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{article.content}</p>
        </CardContent>
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
    <div className="space-y-6">
      {isLoading &&
        Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="bg-secondary/20 border-white/10 p-4">
            <CardHeader className="flex flex-row items-center gap-4 p-2">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-4/5 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
              </div>
            </CardHeader>
            <CardContent className="p-2 pt-0">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md mt-2" />
            </CardContent>
          </Card>
        ))}

      {!isLoading &&
        articles?.map((article, index) => (
          <NewsArticleItem key={article.id} article={article} index={index} />
        ))}
      
      {!isLoading && articles?.length === 0 && (
        <div className="text-center py-10 px-4 bg-secondary/20 rounded-lg">
            <h3 className="text-xl font-semibold">No News... Yet!</h3>
            <p className="text-muted-foreground mt-2">Check back soon for the latest updates.</p>
        </div>
      )}
    </div>
  );
}
