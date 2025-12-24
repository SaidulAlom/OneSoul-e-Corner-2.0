
import { PlayCircle } from 'lucide-react';
import Image from 'next/image';

import { getVlogs } from '@/lib/vlogs';
import { Vlog } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function VlogItem({ vlog }: { vlog: Vlog }) {
  return (
    <Card className="bg-secondary/30 border border-white/10 backdrop-blur-md shadow-lg hover:border-primary/50 transition-colors duration-300 overflow-hidden">
        <a href={vlog.videoUrl} target="_blank" rel="noopener noreferrer">
            <div className="relative aspect-video">
                <Image src={vlog.thumbnailUrl} alt={vlog.title} fill className="object-cover"/>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-16 h-16 text-white"/>
                </div>
            </div>
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-foreground">
                {vlog.title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground line-clamp-2">{vlog.description}</p>
            </CardContent>
        </a>
      </Card>
  );
}

export default async function VlogsList() {
  const vlogs = await getVlogs();

  if (vlogs.length === 0) {
    return (
      <div className="md:col-span-2 text-center py-10 px-4 bg-secondary/20 rounded-lg">
        <h3 className="text-xl font-semibold">No Vlogs Available... Yet!</h3>
        <p className="text-muted-foreground mt-2">Check back soon for new video content.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {vlogs.map((vlog) => (
        <VlogItem key={vlog.id} vlog={vlog} />
      ))}
    </div>
  );
}
