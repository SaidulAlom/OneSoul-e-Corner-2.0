"use client";

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, BookOpen, Award } from 'lucide-react';
import { collection, doc } from 'firebase/firestore';

import CountUp from '@/components/ui/count-up';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore, useMemoFirebase } from '@/firebase';

const formatNumber = (num: number): { value: number; suffix: string } => {
  if (num >= 1000000) {
    return { value: parseFloat((num / 1000000).toFixed(1)), suffix: 'M+' };
  }
  if (num >= 1000) {
    return { value: parseFloat((num / 1000).toFixed(0)), suffix: 'K+' };
  }
  return { value: num, suffix: '' };
};

export default function StatsSection() {
  const firestore = useFirestore();

  const usersCollection = useMemoFirebase(
    () => firestore ? collection(firestore, 'users') : null,
    [firestore]
  );
  const jobsCollection = useMemoFirebase(
    () => firestore ? collection(firestore, 'job_postings') : null,
    [firestore]
  );
  const ebooksCollection = useMemoFirebase(
    () => firestore ? collection(firestore, 'ebooks') : null,
    [firestore]
  );
  const siteStatsDoc = useMemoFirebase(
    () => firestore ? doc(firestore, 'statistics/site') : null,
    [firestore]
  );

  const { data: users, isLoading: loadingUsers } = useCollection(usersCollection);
  const { data: jobs, isLoading: loadingJobs } = useCollection(jobsCollection);
  const { data: ebooks, isLoading: loadingEbooks } = useCollection(ebooksCollection);
  const { data: siteStats, isLoading: loadingStats } = useDoc(siteStatsDoc);

  const userStats = formatNumber(users?.length || 0);
  const jobStats = formatNumber(jobs?.length || 0);
  const ebookStats = formatNumber(ebooks?.length || 0);

  const stats = [
    { icon: Users, value: userStats.value, suffix: userStats.suffix, label: 'Active Users', loading: loadingUsers },
    { icon: Briefcase, value: jobStats.value, suffix: jobStats.suffix, label: 'Jobs Posted', loading: loadingJobs },
    { icon: BookOpen, value: ebookStats.value, suffix: ebookStats.suffix, label: 'E-Books', loading: loadingEbooks },
    { icon: Award, value: siteStats?.successRate || 98, suffix: '%', label: 'Success Rate', loading: loadingStats },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="text-center mb-16">
        <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Trusted by Millions
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Our platform is built on trust, transparency, and results. The numbers speak for themselves.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={stat.label}>
            {stat.loading ? (
              <div className="relative p-8 text-center rounded-3xl bg-secondary/20 border border-white/10 backdrop-blur-md shadow-2xl shadow-black/20 h-full">
                <Skeleton className="h-10 w-10 rounded-full absolute top-6 right-6" />
                <Skeleton className="h-16 w-3/4 mx-auto mt-4" />
                <Skeleton className="h-6 w-1/2 mx-auto mt-4" />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative p-8 text-center rounded-3xl bg-secondary/20 border border-white/10 backdrop-blur-md shadow-2xl shadow-black/20 h-full"
              >
                <div className="absolute top-6 right-6 w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                
                <div className="font-headline font-bold text-5xl md:text-6xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  <CountUp end={stat.value} duration={3} />
                  {stat.suffix}
                </div>
                <p className="mt-2 text-muted-foreground font-medium text-lg">
                  {stat.label}
                </p>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
