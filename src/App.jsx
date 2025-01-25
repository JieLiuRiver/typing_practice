import './App.css';
import TypingEffect from './components/TypingEffect';
import useTypingSound from './hooks/useTypingSound';
import useWordSound from './hooks/useWordSound';
import { useAtom } from 'jotai';
import { currentSentenceAtom } from './store';

function App() {
  const { playSound } = useTypingSound();
  const { playWord } = useWordSound();
  const [currentSentence] = useAtom(currentSentenceAtom);

  return (
    <>
      <div className="typing-container">
        <TypingEffect 
          text={currentSentence.source}
          onType={playSound}
          onWordComplete={playWord}
        />
        <div className="translation">
          翻译：{currentSentence.translation}
        </div>
      </div>
    </>
  );
}

export default App;
