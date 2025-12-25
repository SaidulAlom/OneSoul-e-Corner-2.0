import { useState, useEffect, useMemo } from 'react';
import { onSnapshot, collection, query, where, getDocs, CollectionReference, Query } from 'firebase/firestore';

interface DocumentData {
  id: string;
  [key: string]: any;
}

interface UseCollectionReturn {
  data: DocumentData[] | null;
  isLoading: boolean;
  error: Error | null;
}

export function useCollection(targetRefOrQuery: CollectionReference | Query | null | undefined): UseCollectionReturn {
  const [data, setData] = useState<DocumentData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const memoizedTargetRefOrQuery = useMemo(() => targetRefOrQuery, [targetRefOrQuery]);

  useEffect(() => {
    if (!memoizedTargetRefOrQuery) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(memoizedTargetRefOrQuery, (querySnapshot) => {
      const documents = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setData(documents);
      setIsLoading(false);
    }, (err) => {
      console.error(err);
      setError(err);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [memoizedTargetRefOrQuery]);

  return { data, isLoading, error };
}
