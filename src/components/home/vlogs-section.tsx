"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function VlogsSection() {
  const vlogImages = PlaceHolderImages.filter(img => img.id.startsWith('vlog-thumbnail'));

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Vlogs & Tutorials
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Learn from experts, get career advice, and discover university life through our video content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vlogImages.map((vlog, index) => (
          <motion.div
            key={vlog.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg"
          >
            <motion.div
              className="w-full h-full"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <Image
                src={vlog.imageUrl}
                alt={vlog.description}
                data-ai-hint={vlog.imageHint}
                width={640}
                height={360}
                className="w-full h-auto object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30" />
              <Play className="w-8 h-8 text-white fill-white transition-all duration-300 group-hover:scale-125" />
            </div>
            <div className="absolute bottom-0 left-0 p-5 text-white">
              <h3 className="font-bold text-lg leading-tight transition-transform duration-300 group-hover:-translate-y-1">
                {vlog.description}
              </h3>
            </div>
             <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary transition-colors duration-300 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
