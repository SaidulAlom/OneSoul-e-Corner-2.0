'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, Timestamp } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import type { NewsArticle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Calendar, User, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const formatPublicationDate = (publicationDate: any) => {
    if (!publicationDate) return 'Date not available';
    const date = publicationDate instanceof Timestamp ? publicationDate.toDate() : new Date(publicationDate);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};


export default function NewsArticlePage() {
  const { id } = useParams();
  const firestore = useFirestore();
  const articleId = Array.isArray(id) ? id[0] : id;

  const articleRef = useMemoFirebase(() => {
    if (!firestore || !articleId) return null;
    return doc(firestore, 'news_articles', articleId);
  }, [firestore, articleId]);

  const { data: article, isLoading } = useDoc<NewsArticle>(articleRef);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto max-w-3xl px-4">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="w-full aspect-[16/9] rounded-lg mb-8" />
            <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
            </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center text-center">
        <div>
          <h1 className="text-4xl font-bold">Article Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The article you are looking for does not exist.
          </p>
           <Link href="/news" className="mt-6 inline-block text-primary hover:underline">
            &larr; Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-3xl px-4">
        <article>
          <header className="mb-8">
            <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{article.author}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={article.publicationDate.toString()}>{formatPublicationDate(article.publicationDate)}</time>
                </div>
                 <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <Badge variant="outline">{article.category}</Badge>
                </div>
            </div>
          </header>

          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-8 shadow-2xl shadow-black/30">
            <Image 
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                priority
            />
          </div>

          <div className="prose prose-invert lg:prose-xl max-w-none text-foreground/90 prose-p:leading-relaxed prose-headings:text-foreground">
            {article.content.split('\\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

        </article>
      </div>
    </div>
  );
}
