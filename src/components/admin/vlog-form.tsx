'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  addDoc,
  updateDoc,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import {
  collection,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import type { Vlog } from '@/lib/types';

// Function to extract YouTube video ID from various URL formats
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|m\.youtube\.com\/watch\?v=)([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

// Function to generate YouTube thumbnail URL
function getYouTubeThumbnail(videoId: string): string {
  // Use maxresdefault for highest quality, fallback to hqdefault
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  videoUrl: z.string().url('Please enter a valid video URL.'),
  thumbnailUrl: z.string().url('Please enter a valid thumbnail URL.').optional().or(z.literal('')),
});

interface VlogFormProps {
  vlog?: Vlog;
}

export default function VlogForm({ vlog }: VlogFormProps) {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const isEditMode = !!vlog;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: vlog?.title || '',
      description: vlog?.description || '',
      videoUrl: vlog?.videoUrl || '',
      thumbnailUrl: vlog?.thumbnailUrl || '',
    },
  });

  // Watch videoUrl to auto-generate thumbnail for YouTube videos
  const videoUrl = form.watch('videoUrl');
  
  useEffect(() => {
    if (videoUrl) {
      const videoId = getYouTubeVideoId(videoUrl);
      if (videoId) {
        const thumbnailUrl = getYouTubeThumbnail(videoId);
        form.setValue('thumbnailUrl', thumbnailUrl, { shouldValidate: true });
        toast({
          title: 'Thumbnail Auto-generated',
          description: 'YouTube thumbnail has been automatically set.',
        });
      }
    }
  }, [videoUrl, form, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firebase not initialized',
      });
      return;
    }

    try {
      // Auto-generate thumbnail if not provided and video URL is YouTube
      let thumbnailUrl = values.thumbnailUrl;
      if (!thumbnailUrl && values.videoUrl) {
        const videoId = getYouTubeVideoId(values.videoUrl);
        if (videoId) {
          thumbnailUrl = getYouTubeThumbnail(videoId);
        }
      }

      const dataToSave = {
        ...values,
        thumbnailUrl: thumbnailUrl || values.thumbnailUrl || '',
      };

      if (isEditMode && vlog.id) {
        const vlogRef = doc(firestore, 'vlogs', vlog.id);
        await updateDoc(vlogRef, {
          ...dataToSave,
          publishedDate: vlog.publishedDate, // Keep existing date on edit
        });
        toast({
          title: 'Success',
          description: 'Vlog updated successfully!',
        });
      } else {
        const collectionRef = collection(firestore, 'vlogs');
        const docRef = await addDoc(collectionRef, {
          ...dataToSave,
          publishedDate: serverTimestamp(),
        });
        
        if (!docRef || !docRef.id) {
          throw new Error('Failed to create vlog: No document ID returned');
        }
        
        console.log('Vlog saved successfully with ID:', docRef.id);
        
        toast({
          title: 'Success',
          description: 'Vlog created and saved successfully!',
        });
      }
      
      router.push('/admin/vlogs');
    } catch (error: any) {
      console.error('Error saving vlog:', error);
      const errorMessage = error.message || 'Failed to save vlog';
      
      if (error.code === 'permission-denied') {
        toast({
          variant: 'destructive',
          title: 'Permission Denied',
          description: 'You do not have permission to create vlogs. Please ensure you are signed in.',
        });
      } else if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
        toast({
          variant: 'destructive',
          title: 'Network Error',
          description: 'Failed to save vlog due to network issues. Please check your connection and try again.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error Saving Vlog',
          description: errorMessage || 'An unexpected error occurred. Please try again.',
        });
      }
      
      return;
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter vlog title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <RichTextEditor
                  content={field.value}
                  onChange={field.onChange}
                  placeholder="Write the vlog description here..."
                  minHeight="200px"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                </FormControl>
                <FormDescription>
                  The URL to the video (e.g., YouTube).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="thumbnailUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thumbnail Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="Auto-generated for YouTube videos" {...field} />
                </FormControl>
                <FormDescription>
                  URL for the video's thumbnail image. Automatically generated for YouTube videos.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4">
            <Button type="submit">
                {isEditMode ? 'Update Vlog' : 'Create Vlog'}
            </Button>
            <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                >
                Cancel
            </Button>
        </div>
      </form>
    </Form>
  );
}
