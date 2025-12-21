'use client';

import { initializeFirebase } from '@/firebase';
import { FirebaseProvider } from '@/firebase/provider';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { ReactNode, useEffect, useState } from 'react';

type FirebaseServices = {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [firebaseServices, setFirebaseServices] =
    useState<FirebaseServices | null>(null);

  useEffect(() => {
    // Only initialize Firebase if the API key is available.
    // This prevents the app from crashing during development if the .env file is not configured.
    if (
      typeof window !== 'undefined' &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    ) {
      try {
        const services = initializeFirebase();
        setFirebaseServices(services);
      } catch (error) {
        console.error(
          'Firebase initialization failed. Please check your Firebase project configuration.',
          error
        );
      }
    }
  }, []);

  if (!firebaseServices) {
    // When Firebase is not initialized, we can still render the children.
    // The parts of the app that depend on Firebase will handle their own state or use fallback data.
    return <>{children}</>;
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
