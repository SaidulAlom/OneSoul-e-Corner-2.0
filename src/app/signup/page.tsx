'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, initiateEmailSignUp } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/icons/logo';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { onAuthStateChanged } from 'firebase/auth';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function SignUpPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading: initialUserLoading } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (user) {
      router.replace('/admin');
    }
  }, [user, router]);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setIsSubmitting(false);
            router.replace('/admin');
        }
    }, (error) => {
        setIsSubmitting(false);
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: error.message || "Failed to sign up. Please try again.",
        });
    });

    return () => unsubscribe();
  }, [auth, router, toast]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    initiateEmailSignUp(auth, values.email, values.password);
  };
  
  const isLoading = initialUserLoading || isSubmitting;

  if (isLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <Card className="w-full max-w-sm shadow-2xl shadow-black/30 border-white/10">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Logo className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
          <CardDescription>Sign up to get started.</CardDescription>
        </CardHeader>
        <CardContent>
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
