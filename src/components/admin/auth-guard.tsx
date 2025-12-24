'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If finished loading and there's no user, redirect to login page.
    if (!isUserLoading && !user) {
      router.replace(`/login?redirect=${pathname}`);
    }
  }, [user, isUserLoading, router, pathname]);

  // While checking user auth, show a loading spinner.
  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If user is logged in, render the requested page.
  if (user) {
    return <>{children}</>;
  }

  // If no user and not loading, this will soon redirect.
  // Return null or a loader to prevent flicker.
  return (
    <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
