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
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import type { EBook } from '@/lib/types';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  author: z.string().min(2, 'Author is required.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  coverImageUrl: z.string().url('Please enter a valid image URL.'),
  downloadUrl: z.string().url('Please enter a valid download URL.'),
});

interface EBookFormProps {
  ebook?: EBook;
}

export default function EBookForm({ ebook }: EBookFormProps) {
  const router = useRouter();
  const firestore = useFirestore();
  const isEditMode = !!ebook;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ebook?.title || '',
      author: ebook?.author || '',
      description: ebook?.description || '',
      coverImageUrl: ebook?.coverImageUrl || '',
      downloadUrl: ebook?.downloadUrl || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;

    if (isEditMode && ebook.id) {
      const ebookRef = doc(firestore, 'ebooks', ebook.id);
      updateDocumentNonBlocking(ebookRef, values);
    } else {
      const collectionRef = collection(firestore, 'ebooks');
      addDocumentNonBlocking(collectionRef, values);
    }
    router.push('/admin/ebooks');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                    <Input placeholder="Enter e-book title" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
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
                  placeholder="Write the e-book description here..."
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
            name="coverImageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/cover.png" {...field} />
                </FormControl>
                <FormDescription>
                  URL for the e-book's cover image.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="downloadUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Download URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/ebook.pdf" {...field} />
                </FormControl>
                <FormDescription>
                  Link to the PDF or e-book file.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4">
            <Button type="submit">
                {isEditMode ? 'Update E-Book' : 'Create E-Book'}
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
