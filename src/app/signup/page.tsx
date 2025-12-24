'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, initiateAnonymousSignIn } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/icons/logo';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // If user is logged in, redirect to admin dashboard
    if (user) {
      router.replace('/admin');
    }
  }, [user, router]);

  const handleAnonymousSignIn = () => {
    initiateAnonymousSignIn(auth);
  };

  if (isUserLoading || user) {
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
          <Button
            onClick={handleAnonymousSignIn}
            className="w-full"
            disabled={isUserLoading}
          >
            {isUserLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Sign Up Anonymously'
            )}
          </Button>
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
