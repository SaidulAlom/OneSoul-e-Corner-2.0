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
import { collection, doc } from 'firebase/firestore';
import * as LucideIcons from 'lucide-react';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ProfessionalService } from '@/lib/types';

const iconNames = Object.keys(LucideIcons).filter(key => key.match(/^[A-Z]/));

const formSchema = z.object({
  title: z.string().min(2, 'Title is required.'),
  subtitle: z.string().min(2, 'Subtitle is required.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  icon: z.string().min(1, 'An icon is required.'),
  startingPrice: z.coerce.number().min(0, 'Price must be a positive number.'),
  features: z.string().min(1, "Please add at least one feature, separated by commas"),
});

interface ServiceFormProps {
  service?: ProfessionalService;
}

export default function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter();
  const firestore = useFirestore();
  const isEditMode = !!service;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: service?.title || '',
      subtitle: service?.subtitle || '',
      description: service?.description || '',
      icon: service?.icon || 'Briefcase',
      startingPrice: service?.startingPrice || 0,
      features: service?.features?.join(', ') || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;

    const dataToSave = {
        ...values,
        features: values.features.split(',').map(f => f.trim()),
    };

    if (isEditMode && service.id) {
      const serviceRef = doc(firestore, 'services', service.id);
      updateDocumentNonBlocking(serviceRef, dataToSave);
    } else {
      const collectionRef = collection(firestore, 'services');
      addDocumentNonBlocking(collectionRef, dataToSave);
    }
    router.push('/admin/services');
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
                  <Input placeholder="e.g., Admission Consultancy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtitle</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Form fill-up / Apply" {...field} />
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
                  placeholder="Detailed description of the service..."
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
            name="icon"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Icon</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {iconNames.map(iconName => (
                            <SelectItem key={iconName} value={iconName}>{iconName}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormDescription>Choose an icon to represent the service.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="startingPrice"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Starting Price (₹)</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="e.g., 499" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Features</FormLabel>
              <FormControl>
                <Input placeholder="Feature one, Feature two, Feature three" {...field} />
              </FormControl>
              <FormDescription>
                Enter a comma-separated list of features for this service.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
            <Button type="submit">
                {isEditMode ? 'Update Service' : 'Create Service'}
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
