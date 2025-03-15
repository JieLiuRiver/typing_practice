import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import PropTypes from 'prop-types';
import ContentTypeSelect from './ContentTypeSelect';
import TypingEffect from './TypingEffect';
import useTypingSound from '../hooks/useTypingSound';
import useSentenceCount from '../hooks/useSentenceCount';
import { currentSentenceAtom, isRunningAtom, nextSentenceAtom, prevSentenceAtom, currentIndexAtom, pronunciationTypeAtom } from '../store';
import usePronunciationSound from '../hooks/useWordSound';
import useTTS from '../hooks/useTTS';
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
  const [, prevSentence] = useAtom(prevSentenceAtom);
  const isRunning = useAtomValue(isRunningAtom);
  const { play: playSentence } = usePronunciationSound(currentSentence?.source);
  const { totalSentences } = useSentenceCount();
  const currentIndex = useAtomValue(currentIndexAtom);
  const { getAudioUrl, loadAudio, playAudio, preloadNextAudio } = useTTS();

  const handleComplete = (type) => {
    type === 'next' ? nextSentence() : prevSentence();
    const total = Number(localStorage.getItem('totalPracticeCount') || 0) + type === 'next' ? 1 : -1;
    localStorage.setItem('totalPracticeCount', total);
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    if (currentSentence?.source && isRunning) {
      if (lang === 'de') {
        const url = getAudioUrl(currentSentence.source);
        loadAudio(url)
          .then(() => {
            playAudio(url);
            // 预加载下一个句子
            const nextSentenceText = currentSentence.next?.source;
            if (nextSentenceText) {
              preloadNextAudio(nextSentenceText);
            }
          })
          .catch(err => console.error('德语播放失败', err));
      } else {
        playSentence();
      }
    }
  }, [currentSentence?.source, playSentence, isRunning, lang, getAudioUrl, loadAudio, playAudio]);

  return (
    <div className="typing-container">
      <div className="content-type-selector">
        <ContentTypeSelect />
      </div>
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
      {/* <StatsDisplay /> */}
    </div>
  );
}
