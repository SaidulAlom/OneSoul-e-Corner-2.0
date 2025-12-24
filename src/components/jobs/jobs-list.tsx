
import { Briefcase } from 'lucide-react';

import { getJobPostings } from '@/lib/jobs';
import { JobPosting } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function JobPostingItem({ job }: { job: JobPosting }) {
  return (
    <Card className="bg-secondary/30 border border-white/10 backdrop-blur-md shadow-lg hover:border-primary/50 transition-colors duration-300">
        <CardHeader className="flex flex-row items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
            <Briefcase className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              {job.title}
            </CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
                <span>{job.company}</span> &middot; <span>{job.location}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{job.description}</p>
        </CardContent>
      </Card>
  );
}

export default async function JobsList() {
  const jobs = await getJobPostings();

  if (jobs.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-secondary/20 rounded-lg">
        <h3 className="text-xl font-semibold">No Jobs Posted... Yet!</h3>
        <p className="text-muted-foreground mt-2">Check back soon for new opportunities.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {jobs.map((job) => (
        <JobPostingItem key={job.id} job={job} />
      ))}
    </div>
  );
}
