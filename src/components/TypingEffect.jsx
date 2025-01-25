import { useEffect, useCallback, useState, useRef } from 'react';
import { FaVolumeUp } from 'react-icons/fa';
import WordSpan from './WordSpan';
import { useAtomValue, useSetAtom } from 'jotai';
import { isRunningAtom } from '../store';
import useTypingSound from '../hooks/useTypingSound';
import usePronunciationSound from '../hooks/useWordSound';
import PropTypes from 'prop-types';

const TypingEffect = ({ text, onComplete, onStart }) => {
  const [cursorPos, setCursorPos] = useState(0);
  const [charStates, setCharStates] = useState(Array(text?.length || 0).fill('normal'));
  const isRunning = useAtomValue(isRunningAtom);
  const setIsRunning = useSetAtom(isRunningAtom);
  const { playSound } = useTypingSound();
  const { play: playWordSound } = usePronunciationSound(text || '');

  const isPunctuation = (char) => {
    return /[^a-zA-Z0-9\s]/.test(char);
  };

  const handleKeyDown = useCallback((e) => {
    if (!isRunning) return;
    
    if (e.key === 'Enter') {
      setCursorPos(0);
      setCharStates(Array(text?.length || 0).fill('normal'));
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
          if (cursorPos === text.length - 1) {
            playWordSound();
          }
        } else {
          playSound('wrong');
          // Find start of current word
          let wordStart = cursorPos;
          while (wordStart > 0 && !/\s/.test(text[wordStart - 1])) {
            wordStart--;
          }
          setCursorPos(wordStart);
          // Reset states for current word
          setCharStates(prev => {
            const newStates = [...prev];
            for (let i = wordStart; i < cursorPos; i++) {
              newStates[i] = 'normal';
            }
            return newStates;
          });
        }
      }
    }
  }, [cursorPos, text, playSound, isRunning, playWordSound, onComplete]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    onStart?.(() => setIsRunning(true));
  }, []);

  const charRefs = useRef([]);

  const renderText = () => {
    const words = text?.split(' ') || [];
    let charIndex = 0;
    
    return words.map((word, wordIndex) => {
      const wordChars = word.split('').map((char, charOffset) => {
        const index = charIndex + charOffset;
        let className = 'letter';
        if (index < cursorPos) {
          if (charStates[index] === 'normal') {
            className = 'letter';
          } else {
            className = charStates[index] === 'correct' ? 'letter correct' : 'letter wrong';
          }
        }
        return (
          <span key={`${char}_${index}`} className={className}>
            {char}
          </span>
        );
      });
      
      charIndex += word.length + 1; // +1 for space
      
      return [
        <WordSpan
          key={`word-${wordIndex}`}
          ref={(el) => charRefs.current[wordIndex] = el}
          word={word}
          className="word"
        >
          {wordChars}
        </WordSpan>,
        wordIndex < words.length - 1 && ' '
      ];
    });
  };

  useEffect(() => {
    // Check if we're at the start of a word
    const isWordStart = cursorPos === 0 || text[cursorPos - 1] === ' ';
    
    if (isWordStart && cursorPos < text.length) {
      const wordIndex = text.slice(0, cursorPos).split(' ').length - 1;
      const wordRef = charRefs.current[wordIndex];
      if (wordRef) {
        wordRef.playSound();
      }
    }
  }, [cursorPos, text]);

  return (
    <div className="typing-container">
      {!isRunning && <div className="overlay"></div>}
      <div className="text-display">
        {renderText()}
        <div 
          className="sound-icon"
          onClick={playWordSound}
          style={{
            display: 'inline-block',
            marginLeft: '10px',
            cursor: 'pointer',
            color: '#666',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#333'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
        >
          <FaVolumeUp size={20} />
        </div>
      </div>
    </div>
  );
};

TypingEffect.propTypes = {
  text: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
  onStart: PropTypes.func,
};

export default TypingEffect;
