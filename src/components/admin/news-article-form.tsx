'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useFirestore } from '@/firebase';
import {
  collection,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  addDoc,
  updateDoc,
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
import type { NewsArticle } from '@/lib/types';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
import React, { useState } from 'react';
import Image from 'next/image';

// Firestore has a limit of ~1MB per field (1,048,487 bytes)
const MAX_CONTENT_SIZE = 1000000; // ~1MB in bytes

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  content: z.string()
    .min(20, 'Content must be at least 20 characters.')
    .refine(
      (content) => {
        // Calculate size in bytes (UTF-8 encoding)
        const sizeInBytes = new Blob([content]).size;
        return sizeInBytes <= MAX_CONTENT_SIZE;
      },
      {
        message: `Content is too large. Maximum size is ${Math.round(MAX_CONTENT_SIZE / 1024)}KB. Please reduce the content or split it into multiple articles.`,
      }
    ),
  author: z.string().min(2, 'Author is required.'),
  category: z.string().min(2, 'Category is required.'),
  status: z.enum(['New', 'Urgent', 'Standard']),
  heroImageUrl: z.string().optional(),
  thumbnailImageUrl: z.string().optional(),
});

interface NewsArticleFormProps {
  article?: NewsArticle;
}

export default function NewsArticleForm({ article }: NewsArticleFormProps) {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const isEditMode = !!article;
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(article?.heroImageUrl || null);
  const [thumbnailImagePreview, setThumbnailImagePreview] = useState<string | null>(article?.thumbnailImageUrl || null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: article?.title || '',
      content: article?.content || '',
      author: article?.author || '',
      category: article?.category || '',
      status: article?.status || 'New',
      heroImageUrl: article?.heroImageUrl || `https://picsum.photos/seed/${Math.random()}/1280/720`,
      thumbnailImageUrl: article?.thumbnailImageUrl || `https://picsum.photos/seed/${Math.random()}/640/360`,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firebase not initialized',
      });
      return;
    }

    // Double-check content size before saving
    const contentSize = new Blob([values.content]).size;
    if (contentSize > MAX_CONTENT_SIZE) {
      toast({
        variant: 'destructive',
        title: 'Content Too Large',
        description: `Content size (${Math.round(contentSize / 1024)}KB) exceeds the maximum allowed size of ${Math.round(MAX_CONTENT_SIZE / 1024)}KB. Please reduce the content.`,
      });
      return;
    }
    
    try {
      const dataToSave = {
        title: values.title,
        content: values.content,
        author: values.author,
        category: values.category,
        status: values.status,
        heroImageUrl: heroImagePreview || values.heroImageUrl || `https://picsum.photos/seed/${Math.random()}/1280/720`,
        thumbnailImageUrl: thumbnailImagePreview || values.thumbnailImageUrl || `https://picsum.photos/seed/${Math.random()}/640/360`,
      };

      if (isEditMode && article?.id) {
        const articleRef = doc(firestore, 'news_articles', article.id);
        // Use updateDoc directly to await completion
        await updateDoc(articleRef, {
          ...dataToSave,
          publicationDate: article.publicationDate, // Keep existing date on edit
        });
        toast({
          title: 'Success',
          description: 'Article updated successfully!',
        });
      } else {
        const collectionRef = collection(firestore, 'news_articles');
        // Use addDoc directly to await completion and ensure persistence
        const docRef = await addDoc(collectionRef, {
          ...dataToSave,
          publicationDate: serverTimestamp(),
        });
        
        // Verify the document was created
        if (!docRef || !docRef.id) {
          throw new Error('Failed to create article: No document ID returned');
        }
        
        console.log('Article saved successfully with ID:', docRef.id);
        
        toast({
          title: 'Success',
          description: 'Article created and saved successfully!',
        });
      }
      
      // Only redirect after successful save
      router.push('/admin/news');
    } catch (error: any) {
      console.error('Error saving article:', error);
      const errorMessage = error.message || 'Failed to save article';
      
      // Check for specific Firestore errors
      if (error.code === 'permission-denied') {
        toast({
          variant: 'destructive',
          title: 'Permission Denied',
          description: 'You do not have permission to create articles. Please ensure you are signed in.',
        });
      } else if (errorMessage.includes('longer than') || errorMessage.includes('bytes')) {
        toast({
          variant: 'destructive',
          title: 'Content Too Large',
          description: 'The article content is too large for Firestore. Please reduce the content size or split it into multiple articles.',
        });
      } else if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
        toast({
          variant: 'destructive',
          title: 'Network Error',
          description: 'Failed to save article due to network issues. Please check your connection and try again.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error Saving Article',
          description: errorMessage || 'An unexpected error occurred. Please try again.',
        });
      }
      
      // Don't redirect on error - let user fix and retry
      return;
    }
  }

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string | null>>,
    fieldName: 'heroImageUrl' | 'thumbnailImageUrl'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setter(result);
        form.setValue(fieldName, result); // Set value for validation
      };
      reader.readAsDataURL(file);
    }
  };

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
                <Input placeholder="Enter article title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => {
            const contentSize = new Blob([field.value || '']).size;
            const sizeInKB = Math.round(contentSize / 1024);
            const maxSizeInKB = Math.round(MAX_CONTENT_SIZE / 1024);
            const isNearLimit = contentSize > MAX_CONTENT_SIZE * 0.9;
            
            return (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={field.value}
                    onChange={field.onChange}
                    placeholder="Write the full article content here..."
                    minHeight="300px"
                  />
                </FormControl>
                <FormDescription className={isNearLimit ? 'text-destructive' : ''}>
                  Content size: {sizeInKB}KB / {maxSizeInKB}KB
                  {isNearLimit && ' (Approaching limit)'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Education" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />
        
        <div className="grid md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="thumbnailImageUrl"
            render={({ field }) => (
                 <FormItem>
                    <FormLabel>Thumbnail Image</FormLabel>
                    <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setThumbnailImagePreview, 'thumbnailImageUrl')} className="file:text-foreground"/>
                    </FormControl>
                    <FormDescription>
                        Upload a thumbnail for list views (16:9 ratio recommended).
                    </FormDescription>
                    {thumbnailImagePreview && (
                        <div className="mt-4 relative aspect-video w-full rounded-md border-2 border-dashed border-muted-foreground flex items-center justify-center">
                            <Image src={thumbnailImagePreview} alt="Thumbnail preview" fill className="object-contain rounded-md" />
                        </div>
                    )}
                    <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="heroImageUrl"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Hero Image</FormLabel>
                    <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setHeroImagePreview, 'heroImageUrl')} className="file:text-foreground"/>
                    </FormControl>
                    <FormDescription>
                        Upload a large hero image for the article page.
                    </FormDescription>
                    {heroImagePreview && (
                        <div className="mt-4 relative aspect-video w-full rounded-md border-2 border-dashed border-muted-foreground flex items-center justify-center">
                            <Image src={heroImagePreview} alt="Hero preview" fill className="object-contain rounded-md" />
                        </div>
                    )}
                    <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="flex gap-4">
            <Button type="submit">
                {isEditMode ? 'Update Article' : 'Create Article'}
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
