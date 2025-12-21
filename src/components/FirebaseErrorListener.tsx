'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      console.error('Firestore Permission Error:', error.message, error.context);
      
      const isDevelopment = process.env.NODE_ENV === 'development';

      if (isDevelopment) {
        // In development, we use a toast to show detailed error information.
        // The error is also thrown to be caught by Next.js's error overlay.
        toast({
          variant: 'destructive',
          title: 'Firestore Security Rule Error',
          description: (
            <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
              <code className="text-white">{error.toString()}</code>
            </pre>
          ),
        });
        // Throwing the error will display it in the Next.js error overlay
        throw error;
      } else {
        // In production, you might want to log this to a service like Sentry
        // and show a more generic error message to the user.
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'You do not have permission to perform this action.',
        });
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
