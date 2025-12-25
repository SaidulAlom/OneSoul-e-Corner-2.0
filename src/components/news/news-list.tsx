'use client';

import { ArrowRight, Newspaper } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, query, orderBy } from 'firebase/firestore';
import { useMemo, useEffect } from 'react';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { NewsArticle } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate, stripHtml } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

function NewsArticleItem({ article }: { article: NewsArticle }) {
  let imageUrl = article.thumbnailImageUrl;
  const invalidUrl = 'https://share.google/NAhSwqWsCY9tHvMmR';
  if (imageUrl === invalidUrl || !imageUrl) {
    const seed = article.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    imageUrl = `https://picsum.photos/seed/${seed}/640/360`;
  }

  return (
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
                  <span>{formatDate(article.publishedAt || article.publicationDate)}</span>
                </p>
                <CardTitle className="text-xl font-semibold text-foreground leading-tight">
                    <Link href={`/news/${article.id}`} className="hover:text-primary transition-colors">
                        {article.title}
                    </Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-3 flex-grow">
                <p className="text-muted-foreground line-clamp-3">
                  {(() => {
                    const plainText = stripHtml(article.content);
                    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
                  })()}
                </p>
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
  );
}

function NewsListSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="bg-secondary/30 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row gap-6 p-6">
          <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
            <Skeleton className="w-full h-full rounded-md" />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function NewsList() {
  const firestore = useFirestore();

  const newsArticlesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    try {
      return query(collection(firestore, 'news_articles'), orderBy('publicationDate', 'desc'));
    } catch (err) {
      console.error('Error creating news articles query:', err);
      // Fallback to collection without orderBy if orderBy fails
      return collection(firestore, 'news_articles');
    }
  }, [firestore]);

  const { data: articles, isLoading, error } = useCollection<NewsArticle>(newsArticlesQuery);

  // Debug logging
  useEffect(() => {
    if (articles) {
      console.log('News articles loaded:', articles.length, articles);
    }
    if (error) {
      console.error('News articles error:', error);
    }
  }, [articles, error]);

  // Sort articles client-side if we had to use fallback query
  const sortedArticles = useMemo(() => {
    if (!articles) return null;
    // If query doesn't have orderBy, sort client-side
    return [...articles].sort((a, b) => {
      const dateA = a.publicationDate 
        ? (a.publicationDate instanceof Date 
            ? a.publicationDate.getTime() 
            : typeof a.publicationDate === 'object' && 'toDate' in a.publicationDate
            ? a.publicationDate.toDate().getTime()
            : new Date(a.publicationDate).getTime())
        : 0;
      const dateB = b.publicationDate 
        ? (b.publicationDate instanceof Date 
            ? b.publicationDate.getTime() 
            : typeof b.publicationDate === 'object' && 'toDate' in b.publicationDate
            ? b.publicationDate.toDate().getTime()
            : new Date(b.publicationDate).getTime())
        : 0;
      return dateB - dateA; // Descending order
    });
  }, [articles]);

  if (isLoading) {
    return <NewsListSkeleton />;
  }

  if (error) {
    console.error('Error fetching news articles:', error);
    return (
      <div className="text-center py-10 px-4 bg-destructive/10 rounded-lg border border-destructive/20">
        <Newspaper className="mx-auto h-12 w-12 text-destructive" />
        <h3 className="mt-4 text-xl font-semibold text-destructive">Error Loading News</h3>
        <p className="text-muted-foreground mt-2">
          {error.message || 'Failed to load news articles. Please try refreshing the page.'}
        </p>
        {error.message?.includes('index') && (
          <p className="text-sm text-muted-foreground mt-2">
            A Firestore index may need to be created. Check the browser console for the index link.
          </p>
        )}
      </div>
    );
  }

  if (!sortedArticles || sortedArticles.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-secondary/20 rounded-lg">
        <Newspaper className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-xl font-semibold">No News... Yet!</h3>
        <p className="text-muted-foreground mt-2">Check back soon for the latest updates.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sortedArticles.map((article) => (
        <NewsArticleItem key={article.id} article={article} />
      ))}
    </div>
  );
}
