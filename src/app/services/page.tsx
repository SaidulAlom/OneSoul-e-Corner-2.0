import ServicesList from '@/components/services/services-list';

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-32 pb-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-12">
          <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Our Services
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the innovative services we offer to help you achieve your goals, from career coaching to skill development.
          </p>
        </div>
        
        <ServicesList />

      </div>
    </div>
  );
}
