import { useState, useEffect, useCallback } from 'react';
import useTypingSound from '../hooks/useTypingSound';
import PropTypes from 'prop-types';

const TypingEffect = ({ text }) => {
  const [input, setInput] = useState('');
  const [cursorPos, setCursorPos] = useState(0);
  const { playSound } = useTypingSound();

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Backspace') {
      setCursorPos(prev => Math.max(0, prev - 1));
      playSound('key');
      return;
    }

    if (e.key.length === 1 && cursorPos < text.length) {
      setInput(prev => {
        const newInput = prev.split('');
        newInput[cursorPos] = e.key;
        return newInput.join('');
      });
      setCursorPos(prev => prev + 1);
      
      if (e.key === text[cursorPos]) {
        playSound('correct');
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
      let className = '';
      if (index < input.length) {
        className = char === input[index] ? 'correct' : 'incorrect';
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
