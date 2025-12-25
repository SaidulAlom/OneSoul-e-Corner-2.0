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
import type { JobPosting } from '@/lib/types';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  company: z.string().min(2, 'Company name is required.'),
  location: z.string().min(2, 'Location is required.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
});

interface JobPostingFormProps {
  job?: JobPosting;
}

export default function JobPostingForm({ job }: JobPostingFormProps) {
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const isEditMode = !!job;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: job?.title || '',
      company: job?.company || '',
      location: job?.location || '',
      description: job?.description || '',
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

    try {
      if (isEditMode && job.id) {
        const jobRef = doc(firestore, 'job_postings', job.id);
        // Use updateDoc directly to await completion
        await updateDoc(jobRef, {
          ...values,
          postedDate: job.postedDate, // Keep existing date on edit
        });
        toast({
          title: 'Success',
          description: 'Job posting updated successfully!',
        });
      } else {
        const collectionRef = collection(firestore, 'job_postings');
        // Use addDoc directly to await completion and ensure persistence
        const docRef = await addDoc(collectionRef, {
          ...values,
          postedDate: serverTimestamp(),
        });
        
        // Verify the document was created
        if (!docRef || !docRef.id) {
          throw new Error('Failed to create job posting: No document ID returned');
        }
        
        console.log('Job posting saved successfully with ID:', docRef.id);
        
        toast({
          title: 'Success',
          description: 'Job posting created and saved successfully!',
        });
      }
      
      // Only redirect after successful save
      router.push('/admin/jobs');
    } catch (error: any) {
      console.error('Error saving job posting:', error);
      const errorMessage = error.message || 'Failed to save job posting';
      
      // Check for specific Firestore errors
      if (error.code === 'permission-denied') {
        toast({
          variant: 'destructive',
          title: 'Permission Denied',
          description: 'You do not have permission to create job postings. Please ensure you are signed in.',
        });
      } else if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
        toast({
          variant: 'destructive',
          title: 'Network Error',
          description: 'Failed to save job posting due to network issues. Please check your connection and try again.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error Saving Job Posting',
          description: errorMessage || 'An unexpected error occurred. Please try again.',
        });
      }
      
      // Don't redirect on error - let user fix and retry
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
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter job title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. Google" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. Mountain View, CA" {...field} />
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
                  placeholder="Describe the job responsibilities, requirements, etc."
                  minHeight="300px"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex gap-4">
            <Button type="submit">
                {isEditMode ? 'Update Job' : 'Create Job'}
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
