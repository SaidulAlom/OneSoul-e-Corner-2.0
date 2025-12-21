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
    // Firebase Web SDK is designed to work in the browser.
    if (typeof window !== 'undefined') {
      try {
        const services = initializeFirebase();
        setFirebaseServices(services);
      } catch (error) {
        console.error("Firebase initialization failed:", error);
      }
    }
  }, []);

  if (!firebaseServices) {
    // You can return a loader here if needed, or nothing to not block the page.
    // For now, we render children to allow the rest of the app to display.
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
