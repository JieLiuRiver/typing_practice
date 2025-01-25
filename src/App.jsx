import viteLogo from '/vite.svg';
import './App.css';
import TypingEffect from './components/TypingEffect';

function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <div className="typing-container">
        <TypingEffect text="Hello! Let's practice typing. The quick brown fox jumps over the lazy dog." />
      </div>
    </>
  );
}

export default App;
