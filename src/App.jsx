import './App.css';
import TypingEffect from './components/TypingEffect';
import useTypingSound from './hooks/useTypingSound';
import useWordSound from './hooks/useWordSound';

function App() {
  const { playSound } = useTypingSound();
  const { playWord } = useWordSound();

  return (
    <>
      <div className="typing-container">
        <TypingEffect 
          text="The quick brown fox jumps over the lazy dog"
          onType={playSound}
          onWordComplete={playWord}
        />
      </div>
    </>
  );
}

export default App;
