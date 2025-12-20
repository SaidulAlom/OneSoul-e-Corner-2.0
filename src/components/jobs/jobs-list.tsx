'use client';

import { useEffect, useState } from 'react';
import {
  dynamicContentLoading,
  DynamicContentLoadingOutput,
} from '@/ai/flows/dynamic-content-loading';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const fallbackContent = [
  'Senior Frontend Engineer - Develop next-gen UIs with React and TypeScript.',
  'Product Manager, AI/ML - Drive the strategy for our new AI-powered features.',
  'UX/UI Designer - Create intuitive and beautiful experiences for our users.',
  'Data Scientist - Analyze large datasets to extract meaningful insights.',
  'DevOps Engineer - Automate and streamline our deployment processes.',
  'Marketing Manager - Lead our digital marketing campaigns and grow our audience.',
  'Technical Writer - Produce clear and concise documentation for our products.',
  'Customer Success Manager - Build strong relationships with our enterprise customers.',
];

export default function JobsList() {
  const [content, setContent] = useState<
    DynamicContentLoadingOutput['relevantContent'] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      setIsLoading(true);
      try {
        const result = await dynamicContentLoading({
          userInteractions:
            'User has shown interest in software engineering, product management, and data science roles.',
          contentType: 'jobs',
        });

        if (result && result.relevantContent && result.relevantContent.length > 0) {
          setContent(result.relevantContent);
        } else {
          throw new Error('AI returned no content.');
        }
      } catch (error) {
        console.error('Failed to load dynamic content, using fallback:', error);
        setContent(fallbackContent);
      } finally {
        setIsLoading(false);
      }
    }
    loadContent();
  }, []);

  return (
    <div className="space-y-6">
      {isLoading
        ? Array.from({ length: 5 }).map((_, i) => (
            <Card
              key={i}
              className="bg-secondary/20 border-white/10 p-4"
            >
              <CardHeader className="flex flex-row items-center gap-4 p-2">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-4/5 rounded-md" />
                </div>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md mt-2" />
              </CardContent>
            </Card>
          ))
        : content?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-secondary/30 border border-white/10 backdrop-blur-md shadow-lg hover:border-primary/50 transition-colors duration-300">
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {item.split(' - ')[0]}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {item.split(' - ')[1] || item}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
    </div>
  );
}
