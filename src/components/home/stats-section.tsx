"use client";

import { motion } from 'framer-motion';
import { Users, Briefcase, BookOpen, Award } from 'lucide-react';
import CountUp from '@/components/ui/count-up';

const stats = [
  { icon: Users, value: 1.2, suffix: 'M+', label: 'Active Users' },
  { icon: Briefcase, value: 50, suffix: 'K+', label: 'Jobs Posted' },
  { icon: BookOpen, value: 10, suffix: 'K+', label: 'Books & Courses' },
  { icon: Award, value: 98, suffix: '%', label: 'Success Rate' },
];

export default function StatsSection() {
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
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="relative p-8 text-center rounded-3xl bg-secondary/20 border border-white/10 backdrop-blur-md shadow-2xl shadow-black/20"
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
        ))}
      </div>
    </section>
  );
}
