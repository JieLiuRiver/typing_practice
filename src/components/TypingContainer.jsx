import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import PropTypes from 'prop-types';
import TypingEffect from './TypingEffect';
import StatsDisplay from './StatsDisplay';
import useTypingSound from '../hooks/useTypingSound';
import useSentenceCount from '../hooks/useSentenceCount';
import { currentSentenceAtom, isRunningAtom, nextSentenceAtom, currentIndexAtom, pronunciationTypeAtom } from '../store';
import usePronunciationSound from '../hooks/useWordSound';
import useGerman from '../hooks/useGerman';
import { useEffect } from 'react';

export default function TypingContainer({ lang }) {
  TypingContainer.propTypes = {
    lang: PropTypes.string
  };
  const setPronunciationType = useSetAtom(pronunciationTypeAtom);
  
  useEffect(() => {
    if (lang) {
      setPronunciationType(lang);
    }
  }, [lang, setPronunciationType]);

  const { playSound } = useTypingSound();
  const [currentSentence] = useAtom(currentSentenceAtom);
  const [, nextSentence] = useAtom(nextSentenceAtom);
  const isRunning = useAtomValue(isRunningAtom);
  const { play: playSentence } = usePronunciationSound(currentSentence?.source);
  const { totalSentences } = useSentenceCount();
  const currentIndex = useAtomValue(currentIndexAtom);
  const { getAudioUrl, loadAudio, playAudio } = useGerman();

  const handleComplete = () => {
    nextSentence();
    const total = Number(localStorage.getItem('totalPracticeCount') || 0) + 1;
    localStorage.setItem('totalPracticeCount', total);
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    if (currentSentence?.source && isRunning) {
      if (lang === 'de') {
        const url = getAudioUrl('de', currentSentence.source);
        loadAudio(url)
          .then(() => playAudio(url))
          .catch(err => console.error('德语播放失败', err));
      } else {
        playSentence();
      }
    }
  }, [currentSentence?.source, playSentence, isRunning, lang, getAudioUrl, loadAudio, playAudio]);

  return (
    <div className="typing-container">
      <div className={`total-sentences`}>
        {`${currentIndex + 1}/${totalSentences}`}
      </div>
      <TypingEffect
        text={currentSentence.source?.replace(/[.?!]$/, '') ?? ''}
        onType={playSound}
        onComplete={handleComplete}
      />
      <div className="translation">
        {currentSentence.translation}
      </div>
      <StatsDisplay />
    </div>
  );
}
