import SubmitJobForm from "@/components/submit-job-form";

export default function SubmitJobPage() {
  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Post a Job
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Reach thousands of qualified candidates by posting your job opportunity on NexusEd.
          </p>
        </div>
        <div className="relative p-8 rounded-3xl bg-secondary/20 border border-white/10 backdrop-blur-md shadow-2xl shadow-black/20">
            <SubmitJobForm />
        </div>
      </div>
    </div>
  );
}
