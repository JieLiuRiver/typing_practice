import { forwardRef, useImperativeHandle } from 'react';
import usePronunciationSound from '../hooks/useWordSound';
import PropTypes from 'prop-types';

const WordSpan = forwardRef(function WordSpan({ word, className, children }, ref) {
  const { play } = usePronunciationSound(word);

  useImperativeHandle(ref, () => ({
    playSound: () => play()
  }));

  return (
    <span className={className}>
      {children}
    </span>
  );
});

WordSpan.propTypes = {
  word: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node
};

export default WordSpan;
