'use client';

import {
  collection,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Vlog } from '@/lib/types';
import Image from 'next/image';

function VlogItem({
  vlog,
  index,
}: {
  vlog: Vlog;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
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
    </motion.div>
  );
}

export default function VlogsList() {
  const firestore = useFirestore();

  const vlogsCollectionQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'vlogs'),
      orderBy('publishedDate', 'desc')
    );
  }, [firestore]);

  const {
    data: vlogs,
    isLoading,
    error,
  } = useCollection<Vlog>(vlogsCollectionQuery);

  if (error) {
    return (
      <div className="text-center py-10 px-4">
        <p className="text-destructive">
          Error loading vlogs: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {isLoading &&
        Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="bg-secondary/20 border-white/10">
                <Skeleton className="aspect-video w-full" />
                <CardHeader>
                    <Skeleton className="h-6 w-3/4 rounded-md" />
                </CardHeader>
                <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-5/6 rounded-md" />
                </CardContent>
            </Card>
          ))}

      {!isLoading &&
        vlogs?.map((vlog, index) => (
          <VlogItem key={vlog.id} vlog={vlog} index={index} />
        ))}
      
      {!isLoading && vlogs?.length === 0 && (
        <div className="md:col-span-2 text-center py-10 px-4 bg-secondary/20 rounded-lg">
            <h3 className="text-xl font-semibold">No Vlogs Available... Yet!</h3>
            <p className="text-muted-foreground mt-2">Check back soon for new video content.</p>
        </div>
      )}
    </div>
  );
}
