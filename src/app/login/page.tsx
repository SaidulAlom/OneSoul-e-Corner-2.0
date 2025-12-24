'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, initiateAnonymousSignIn } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/icons/logo';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
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
          <CardTitle className="font-headline text-2xl">Admin Access</CardTitle>
          <CardDescription>Sign in to manage NexusEd content.</CardDescription>
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
              'Sign In Anonymously'
            )}
          </Button>
           <p className="mt-4 text-center text-xs text-muted-foreground">
            This provides temporary access for demonstration. Full authentication can be added later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
