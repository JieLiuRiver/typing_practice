import { useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import TypingEffect from './TypingEffect';
import StatsDisplay from './StatsDisplay';
import useTypingSound from '../hooks/useTypingSound';
import usePronunciationSound from '../hooks/useWordSound';
import useSentenceCount from '../hooks/useSentenceCount';
import { currentSentenceAtom, isRunningAtom, nextSentenceAtom } from '../store';

export default function TypingContainer() {
  const { playSound } = useTypingSound();
  const [currentSentence] = useAtom(currentSentenceAtom);
  const [, nextSentence] = useAtom(nextSentenceAtom);
  const isRunning = useAtomValue(isRunningAtom);
  const { play: playSentence } = usePronunciationSound(currentSentence?.source);
  const { totalSentences, isLoading } = useSentenceCount();

  const handleComplete = () => {
    nextSentence();
    const total = Number(localStorage.getItem('totalPracticeCount') || 0) + 1;
    localStorage.setItem('totalPracticeCount', total);
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    if (currentSentence?.source && isRunning) {
      playSentence();
    }
  }, [currentSentence?.source, playSentence, isRunning]);

  return (
    <div className="typing-container">
      <div className={`total-sentences ${isLoading ? 'loading' : ''}`}>
        {isLoading ? 'Loading...' : `Total: ${totalSentences}`}
      </div>
      <TypingEffect 
        text={currentSentence.source?.replace(/\.$/, '') ?? ''}
        onType={playSound}
        onComplete={handleComplete}
      />
      <div className="translation">
        {currentSentence.translation}
      </div>
      <StatsDisplay />
    </div>
  );
}
