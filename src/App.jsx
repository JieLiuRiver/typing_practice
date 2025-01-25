import './App.css';
import TypingEffect from './components/TypingEffect';
import useTypingSound from './hooks/useTypingSound';
import usePronunciationSound from './hooks/useWordSound';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { currentSentenceAtom, nextSentenceAtom } from './store';

function App() {
  const { playSound } = useTypingSound();
  const [currentSentence] = useAtom(currentSentenceAtom);
  const [, nextSentence] = useAtom(nextSentenceAtom);
  // 用于播放整个句子
  const { play: playSentence } = usePronunciationSound(currentSentence?.source);

  useEffect(() => {
    // 在组件加载时播放整个句子
    if (currentSentence?.source) {
      playSentence();
    }
  }, [currentSentence?.source, playSentence]);

  // const handleWordComplete = (word) => {
  //   console.log('handleWordComplete',  word)
  // };

  return (
    <>
      <div className="typing-container">
        <TypingEffect 
          text={currentSentence.source}
          onType={playSound}
          onComplete={() => {
            nextSentence()
          }}
        />
        <div className="translation">
          Translation: {currentSentence.translation}
        </div>
      </div>
    </>
  );
}

export default App;
