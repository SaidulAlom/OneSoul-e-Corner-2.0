import { useState, useEffect, useMemo } from 'react';
import { onSnapshot, doc, DocumentReference } from 'firebase/firestore';

interface DocumentData {
  id: string;
  [key: string]: any;
}

interface UseDocReturn {
  data: DocumentData | null;
  isLoading: boolean;
  error: Error | null;
}

export function useDoc(targetRef: DocumentReference | null | undefined): UseDocReturn {
  const [data, setData] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const memoizedTargetRef = useMemo(() => targetRef, [targetRef]);

  useEffect(() => {
    if (!memoizedTargetRef) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(memoizedTargetRef, (doc) => {
      if (doc.exists()) {
        setData({ ...doc.data(), id: doc.id });
      }
      setIsLoading(false);
    }, (err) => {
      console.error(err);
      setError(err);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [memoizedTargetRef]);

  return { data, isLoading, error };
}
