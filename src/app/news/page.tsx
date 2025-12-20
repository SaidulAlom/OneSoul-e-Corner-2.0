import NewsList from '@/components/news/news-list';

export default function NewsPage() {
  return (
    <div className="min-h-screen pt-32 pb-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-12">
          <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Latest News
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Stay informed with the latest updates, stories, and breakthroughs, curated just for you.
          </p>
        </div>
        
        <NewsList />

      </div>
    </div>
  );
}
