'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

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

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  content: z.string().min(20, 'Content must be at least 20 characters.'),
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
      alert('Firebase not initialized');
      return;
    }
    
    try {
      await addDoc(collection(firestore, 'news'), {
        title: values.title,
        content: values.content,
        summary: values.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
        author: values.author,
        category: values.category,
        publishedAt: new Date().toISOString(),
        imageUrl: 'https://via.placeholder.com/640x360',
        heroImageUrl: 'https://via.placeholder.com/1280x720',
        thumbnailImageUrl: 'https://via.placeholder.com/640x360',
        tags: [values.category.toLowerCase()],
        status: values.status
      });
      
      alert('Article created successfully!');
      router.push('/admin/news');
    } catch (error) {
      console.error('Error saving article:', error);
      alert(`Error: ${error.message}`);
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
          render={({ field }) => (
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
              <FormMessage />
            </FormItem>
          )}
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
