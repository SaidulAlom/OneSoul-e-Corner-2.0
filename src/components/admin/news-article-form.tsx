'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import {
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';
import { useFirestore } from '@/firebase';
import {
  collection,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

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
import { Textarea } from '@/components/ui/textarea';
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
  heroImageUrl: z.string().url('Please enter a valid URL for the hero image.'),
  thumbnailImageUrl: z.string().url('Please enter a valid URL for the thumbnail image.'),
});

interface NewsArticleFormProps {
  article?: NewsArticle;
}

export default function NewsArticleForm({ article }: NewsArticleFormProps) {
  const router = useRouter();
  const firestore = useFirestore();
  const isEditMode = !!article;
  const [contentImagePreview, setContentImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: article?.title || '',
      content: article?.content || 'Placeholder content for image upload simulation.',
      author: article?.author || '',
      category: article?.category || '',
      status: article?.status || 'New',
      heroImageUrl: article?.heroImageUrl || `https://picsum.photos/seed/${Math.random()}/1280/720`,
      thumbnailImageUrl: article?.thumbnailImageUrl || `https://picsum.photos/seed/${Math.random()}/640/360`,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;
    
    // In a real app, you'd upload the file from the file input,
    // get the URL, and set it as values.content before saving.
    // For now, we're just submitting the form as is.
    
    if (isEditMode && article.id) {
      const articleRef = doc(firestore, 'news_articles', article.id);
      updateDocumentNonBlocking(articleRef, {
        ...values,
        publicationDate: serverTimestamp(), // Or keep existing date
      });
    } else {
      const collectionRef = collection(firestore, 'news_articles');
      addDocumentNonBlocking(collectionRef, {
        ...values,
        publicationDate: serverTimestamp(),
      });
    }
    router.push('/admin/news');
  }

  const handleContentImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setContentImagePreview(reader.result as string);
        // Here you would typically use a file upload service
        // and then set the returned URL to the form value.
        // form.setValue('content', 'url-from-upload-service');
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
        
        <FormItem>
            <FormLabel>Content</FormLabel>
            <FormControl>
                <Input type="file" accept="image/*" onChange={handleContentImageChange} className="file:text-foreground"/>
            </FormControl>
            <FormDescription>
                Upload an image for the main content from your local storage.
            </FormDescription>
            {contentImagePreview && (
                <div className="mt-4 relative w-full h-64 rounded-md border-2 border-dashed border-muted-foreground flex items-center justify-center">
                    <Image src={contentImagePreview} alt="Content preview" fill className="object-contain rounded-md" />
                </div>
            )}
            <FormMessage />
        </FormItem>

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
        <div className="grid md:grid-cols-2 gap-8">
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
            <FormField
            control={form.control}
            name="thumbnailImageUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Thumbnail Image URL</FormLabel>
                <FormControl>
                    <Input placeholder="https://example.com/thumbnail.png" {...field} />
                </FormControl>
                <FormDescription>
                    Image for list views (aspect ratio 16:9).
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
            control={form.control}
            name="heroImageUrl"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Hero Image URL</FormLabel>
                <FormControl>
                    <Input placeholder="https://example.com/hero-image.png" {...field} />
                </FormControl>
                <FormDescription>
                    Large image for the top of the article page.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
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
