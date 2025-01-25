import './App.css';
import TypingEffect from './components/TypingEffect';
import useTypingSound from './hooks/useTypingSound';
import useWordSound from './hooks/useWordSound';
import { useAtom } from 'jotai';
import { currentSentenceAtom, nextSentenceAtom } from './store';

function App() {
  const { playSound } = useTypingSound();
  const { playWord } = useWordSound();
  const [currentSentence] = useAtom(currentSentenceAtom);
  const [, nextSentence] = useAtom(nextSentenceAtom);

  return (
    <>
      <div className="typing-container">
        <TypingEffect 
          text={currentSentence.source}
          onType={playSound}
          onWordComplete={playWord}
          onComplete={() => {
            nextSentence()
          }}
        />
        <div className="translation">
          翻译：{currentSentence.translation}
        </div>
      </div>
    </>
  );
}

export default App;
