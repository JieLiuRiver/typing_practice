import { useAtomValue } from 'jotai';
import { sentencesAtom } from '../store';

interface UseSentenceCountResult {
  totalSentences: number;
  error?: Error;
}

const useSentenceCount = (): UseSentenceCountResult => {
  const sentences = useAtomValue(sentencesAtom);
  
  return {
    totalSentences: sentences.length,
    error: undefined
  };
};

export default useSentenceCount;
