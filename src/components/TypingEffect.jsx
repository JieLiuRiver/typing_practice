import { useState, useEffect, useCallback } from 'react';
import useTypingSound from '../hooks/useTypingSound';
import usePronunciationSound from '../hooks/useWordSound';
import PropTypes from 'prop-types';

const TypingEffect = ({ text }) => {
  const [cursorPos, setCursorPos] = useState(0);
  const [charStates, setCharStates] = useState(Array(text.length).fill('normal'));
  const { playSound } = useTypingSound();
  const { play: playWordSound } = usePronunciationSound(text);

  const handleKeyDown = useCallback((e) => {
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

    if (e.key.length === 1 && cursorPos < text.length) {
      setCharStates(prev => {
        const newStates = [...prev];
        if (e.key.toLowerCase() === text[cursorPos].toLowerCase()) {
          newStates[cursorPos] = 'correct';
        } else {
          newStates[cursorPos] = 'incorrect';
        }
        return newStates;
      });
      setCursorPos(prev => prev + 1);
      
      if (e.key.toLowerCase() === text[cursorPos].toLowerCase()) {
        playSound('correct');
        
        // Check if word is completed
        if (cursorPos === text.length - 1) {
          playWordSound();
        }
      } else {
        playSound('wrong');
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
};

export default TypingEffect;
