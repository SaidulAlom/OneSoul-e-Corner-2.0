"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';

export default function Bookshelf() {
  const bookImages = PlaceHolderImages.filter(img => img.id.startsWith('book-cover'));

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Featured Books & E-Books
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our curated collection of essential reading for students and professionals.
        </p>
      </div>

      <div className="relative" style={{ perspective: '1500px' }}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {bookImages.map((book, index) => (
            <motion.div
              key={book.id}
              className="group cursor-pointer"
              whileHover="hover"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div
                className="relative rounded-lg shadow-lg overflow-hidden"
                variants={{
                  hover: {
                    y: -10,
                    rotateY: 10,
                    boxShadow: '0 25px 50px -12px rgba(143, 0, 255, 0.25)',
                  },
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Image
                  src={book.imageUrl}
                  alt={book.description}
                  data-ai-hint={book.imageHint}
                  width={400}
                  height={600}
                  className="w-full h-auto object-cover"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                 <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="font-bold text-sm">View Details</p>
                 </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
