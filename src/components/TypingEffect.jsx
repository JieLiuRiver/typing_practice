import { useState, useEffect, useCallback } from 'react';
import useTypingSound from '../hooks/useTypingSound';
import usePronunciationSound from '../hooks/useWordSound';
import PropTypes from 'prop-types';

const TypingEffect = ({ text, onComplete }) => {
  const [cursorPos, setCursorPos] = useState(0);
  const [charStates, setCharStates] = useState(Array(text.length).fill('normal'));
  const { playSound } = useTypingSound();
  const { play: playWordSound } = usePronunciationSound(text);

  const isPunctuation = (char) => {
    return /[^a-zA-Z0-9\s]/.test(char);
  };

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      setCursorPos(0);
      setCharStates(Array(text.length).fill('normal'));
      onComplete?.();
      return;
    }

    if (e.key === 'Backspace') {
      setCursorPos(prev => Math.max(0, prev - 1));
      setCharStates(prev => {
        const newStates = [...prev];
        newStates[cursorPos - 1] = 'normal';
        return newStates;
      });
      playSound('key');
      return;
    }

    if (cursorPos < text.length) {
      const currentChar = text[cursorPos];
      
      // Automatically advance for punctuation
      if (isPunctuation(currentChar)) {
        setCharStates(prev => {
          const newStates = [...prev];
          newStates[cursorPos] = 'correct';
          return newStates;
        });
        setCursorPos(prev => prev + 1);
        playSound('correct');
        return;
      }

      if (e.key.length === 1) {
        setCharStates(prev => {
          const newStates = [...prev];
          if (e.key.toLowerCase() === currentChar.toLowerCase()) {
            newStates[cursorPos] = 'correct';
          } else {
            newStates[cursorPos] = 'incorrect';
          }
          return newStates;
        });
        setCursorPos(prev => prev + 1);
        
        if (e.key.toLowerCase() === currentChar.toLowerCase()) {
          playSound('correct');
          
          // Check if word is completed
          if (cursorPos === text.length - 1) {
            playWordSound();
          }
        } else {
          playSound('wrong');
        }
      }
    }
  }, [cursorPos, text.length, playSound]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const renderText = () => {
    return text.split('').map((char, index) => {
      let className = 'letter';
      if (index < cursorPos) {
        if (charStates[index] === 'normal') {
          className = 'letter';
        } else {
          className = charStates[index] === 'correct' ? 'letter correct' : 'letter wrong';
        }
      }
      return {
        char: char,
        className: className,
        key: index
      };
    });
  };

  return (
    <div className="typing-container">
      <div className="text-display">
        {renderText().map(({ char, className, key }) => (
          <span key={key} className={className}>
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

TypingEffect.propTypes = {
  text: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
};

export default TypingEffect;
