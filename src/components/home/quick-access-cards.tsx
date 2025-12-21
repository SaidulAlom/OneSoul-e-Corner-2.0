"use client";

import { motion } from 'framer-motion';
import { GraduationCap, Award, FileText, Briefcase } from 'lucide-react';
import React from 'react';

const cardData = [
  {
    title: 'Admission',
    icon: GraduationCap,
    description: 'Find your perfect course and university.',
  },
  {
    title: 'Admit Card',
    icon: FileText,
    description: 'Download your exam admit cards easily.',
  },
  {
    title: 'Results',
    icon: Award,
    description: 'Check your exam results instantly.',
  },
  {
    title: 'Private Jobs',
    icon: Briefcase,
    description: 'Discover career opportunities.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

export default function QuickAccessCards() {
  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Instant Access
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Jump right into the most important sections of our platform with a single click.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {cardData.map((card, i) => (
          <motion.div
            key={card.title}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}
          >
            <div
              className="group relative h-full w-full rounded-2xl p-6 overflow-hidden bg-secondary/30 border border-white/10 shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_40%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
              
              <div>
                <div className="mb-4 inline-flex items-center justify-center p-3 rounded-xl bg-primary/20 border border-primary/30">
                  <card.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-headline font-semibold text-foreground">
                  {card.title}
                </h3>
                <p className="mt-2 text-muted-foreground">
                  {card.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}