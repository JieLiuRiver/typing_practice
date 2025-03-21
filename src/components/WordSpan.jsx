import { forwardRef, useImperativeHandle } from 'react';
import usePronunciationSound from '../hooks/useWordSound';
import useTTS from '../hooks/useTTS';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

const WordSpan = forwardRef(function WordSpan({ word, className, children }, ref) {
  const { play } = usePronunciationSound(word);
  const { getAudioUrl, loadAudio, playAudio } = useTTS();
  const { lang } = useParams()

  const playSound = async () => {
    if (lang === 'de') {
      try {
        const url = getAudioUrl(word);
        await loadAudio(url);
        playAudio(url);
      } catch (err) {
        console.error('德语播放失败', err);
        play();
      }
    } else {
      play();
    }
  };

  useImperativeHandle(ref, () => ({
    playSound
  }), [playSound]);

  return (
    <span className={className}>
      {children}
    </span>
  );
});

WordSpan.propTypes = {
  word: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  lang: PropTypes.oneOf(['en', 'de'])
};

WordSpan.defaultProps = {
  lang: 'en'
};

export default WordSpan;
