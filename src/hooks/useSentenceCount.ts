import { useEffect, useState } from 'react';

interface UseSentenceCountResult {
  totalSentences: number;
  isLoading: boolean;
  error?: Error;
}

const useSentenceCount = (): UseSentenceCountResult => {
  const [totalSentences, setTotalSentences] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const calculateTotalSentences = async () => {
      try {
        const [response01, response02] = await Promise.all([
          fetch('/src/assets/sentences/01.json'),
          fetch('/src/assets/sentences/02.json')
        ]);
        
        const [data01, data02] = await Promise.all([
          response01.json(),
          response02.json()
        ]);
        
        setTotalSentences(data01.length + data02.length);
      } catch (err) {
        setError(err as Error);
        console.error('Error loading sentences:', err);
      } finally {
        setIsLoading(false);
      }
    };

    calculateTotalSentences();
  }, []);

  return { totalSentences, isLoading, error };
};

export default useSentenceCount;
