import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const TypingEffect = ({ text }) => {
  const [input, setInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const synthRef = useRef(null);
  const utteranceRef = useRef(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;

    const handleKeyDown = (e) => {
      if (e.key.length === 1) {
        setInput(prev => {
          const newInput = prev + e.key;
          // Play word audio when space is pressed
          if (e.key === ' ') {
            const words = newInput.trim().split(' ');
            const lastWord = words[words.length - 1]; // Get the last word
            if (lastWord && lastWord.length > 0) {
              const utterance = new SpeechSynthesisUtterance(lastWord);
              utterance.lang = 'en-US';
              utterance.rate = 1;
              utterance.pitch = 1;
              synthRef.current.speak(utterance);
            }
          }
          return newInput;
        });
        setCurrentIndex(prev => prev + 1);
      } else if (e.key === 'Backspace') {
        setInput(prev => prev.slice(0, -1));
        setCurrentIndex(prev => Math.max(0, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Clean up speech synthesis
      if (synthRef.current && utteranceRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [text]);

  const renderText = () => {
    return text.split('').map((char, index) => {
      let className = '';
      if (index < currentIndex) {
        className = input[index] === char ? 'correct' : 'incorrect';
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="typing-container">
      <div className="text-display">
        {renderText()}
      </div>
    </div>
  );
};

TypingEffect.propTypes = {
  text: PropTypes.string.isRequired,
};

export default TypingEffect;
