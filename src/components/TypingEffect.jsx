import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const TypingEffect = ({ text }) => {
  const [input, setInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.length === 1) {
        setInput(prev => prev + e.key);
        setCurrentIndex(prev => prev + 1);
      } else if (e.key === 'Backspace') {
        setInput(prev => prev.slice(0, -1));
        setCurrentIndex(prev => Math.max(0, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
