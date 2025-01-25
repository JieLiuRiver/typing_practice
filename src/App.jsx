import './App.css';
import TypingEffect from './components/TypingEffect';
import StatsDisplay from './components/StatsDisplay';
import useTypingSound from './hooks/useTypingSound';
import usePronunciationSound from './hooks/useWordSound';
import useSentenceCount from './hooks/useSentenceCount';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { currentSentenceAtom, nextSentenceAtom } from './store';

function App() {
  const { playSound } = useTypingSound();
  const [currentSentence] = useAtom(currentSentenceAtom);
  const [, nextSentence] = useAtom(nextSentenceAtom);
  const { play: playSentence } = usePronunciationSound(currentSentence?.source);

  const { totalSentences, isLoading } = useSentenceCount();

  const handleComplete = () => {
    nextSentence();
    const total = Number(localStorage.getItem('totalPracticeCount') || 0) + 1;
    localStorage.setItem('totalPracticeCount', total);
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    // Play sentence when component loads
    if (currentSentence?.source) {
      playSentence();
    }
  }, [currentSentence?.source, playSentence]);

  return (
    <>
      <div className="typing-container">
        <div className={`total-sentences ${isLoading ? 'loading' : ''}`}>
          {isLoading ? 'Loading...' : `Total: ${totalSentences}`}
        </div>
        <TypingEffect 
          text={currentSentence.source}
          onType={playSound}
          onComplete={handleComplete}
        />
        <div className="translation">
          Translation: {currentSentence.translation}
        </div>
        <StatsDisplay />
      </div>
    </>
  );
}

export default App;
