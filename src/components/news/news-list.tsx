
import { ArrowRight, Newspaper } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { getNewsArticles } from '@/lib/news';
import { NewsArticle } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

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
                  <span>{formatDate(article.publicationDate)}</span>
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
  );
}

export default async function NewsList() {
  const articles = await getNewsArticles();

  if (articles.length === 0) {
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
      {articles.map((article) => (
        <NewsArticleItem key={article.id} article={article} />
      ))}
    </div>
  );
}
