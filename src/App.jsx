import './App.css';
import TypingEffect from './components/TypingEffect';

function App() {
  return (
    <>
      <div className="typing-container">
        <TypingEffect text="Hello! Let's practice typing. The quick brown fox jumps over the lazy dog." />
      </div>
    </>
  );
}

export default App;
