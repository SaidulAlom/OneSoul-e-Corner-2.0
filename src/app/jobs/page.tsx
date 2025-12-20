import JobsList from '@/components/jobs/jobs-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function JobsPage() {
  return (
    <div className="min-h-screen pt-32 pb-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-12">
          <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Career Opportunities
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Find your next career move with our curated list of job openings from top companies.
          </p>
           <div className="mt-8">
            <Button asChild size="lg" className="rounded-full shadow-[0_0_20px_theme(colors.primary/0.5)] hover:shadow-[0_0_35px_theme(colors.primary)] transition-all duration-300">
              <Link href="/submit-job">
                Post a Job <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        
        <JobsList />

      </div>
    </div>
  );
}
