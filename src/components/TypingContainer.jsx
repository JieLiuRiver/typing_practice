import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import PropTypes from 'prop-types';
import ContentTypeSelect from './ContentTypeSelect';
import TypingEffect from './TypingEffect';
import useTypingSound from '../hooks/useTypingSound';
import useSentenceCount from '../hooks/useSentenceCount';
import { currentSentenceAtom, isRunningAtom, nextSentenceAtom, prevSentenceAtom, currentIndexAtom, pronunciationTypeAtom } from '../store';
import usePronunciationSound from '../hooks/useWordSound';
import useTTS from '../hooks/useTTS';
import { useEffect, useState } from 'react';
import { FaVolumeUp } from "react-icons/fa";

import "./TypingContainer.css"

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
  const [currentIndex, setCurrentIndex] = useAtom(currentIndexAtom);
  const { getAudioUrl, loadAudio, playAudio, preloadNextAudio } = useTTS();

  // 添加状态用于输入框
  const [inputIndex, setInputIndex] = useState('');

  // 处理输入框变化
  const handleIndexChange = (e) => {
    setInputIndex(e.target.value);
  };

  // 处理输入框失去焦点或按下回车键
  const handleIndexSubmit = (e) => {
    if (e.type === 'blur' || (e.type === 'keydown' && e.key === 'Enter')) {
      const newIndex = parseInt(inputIndex, 10) - 1; // 转换为0基索引
      if (!isNaN(newIndex) && newIndex >= 0 && newIndex < totalSentences) {
        setCurrentIndex(newIndex);
      } else {
        // 如果输入无效，重置为当前索引
        setInputIndex('');
      }
    }
  };

  // 当currentIndex变化时更新输入框
  useEffect(() => {
    setInputIndex('');
  }, [currentIndex]);

  const handleComplete = (type) => {
    type === 'next' ? nextSentence() : prevSentence();
    const total = Number(localStorage.getItem('totalPracticeCount') || 0) + type === 'next' ? 1 : -1;
    localStorage.setItem('totalPracticeCount', total);
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    if (currentSentence?.source && isRunning) {
      if (lang === 'de') {
        const onlyDePart = currentSentence.source.replace(/\(.*?\)/g, '').trim();
        const url = getAudioUrl(onlyDePart);
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

  const [autoPlayTimer, setAutoPlayTimer] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false); // 新增播放状态

  const startAutoPlay = () => {
    stopAutoPlay();
    const timer = setInterval(() => {
      handleComplete('next');
    }, 5000);
    setAutoPlayTimer(timer);
    setIsAutoPlaying(true); // 设置播放状态
  };

  const stopAutoPlay = () => {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      setAutoPlayTimer(null);
      setIsAutoPlaying(false); // 清除播放状态
    }
  };

  // 添加组件卸载时的清理
  useEffect(() => {
    return () => stopAutoPlay();
  }, []);

  return (
    <div className="typing-container">
      <div className="content-type-selector">
        <ContentTypeSelect />
      </div>
      <div className={`total-sentences`}>
        <input
          type="number"
          value={inputIndex || currentIndex + 1}
          onChange={handleIndexChange}
          onBlur={handleIndexSubmit}
          onKeyDown={handleIndexSubmit}
          min="1"
          max={totalSentences}
          className="sentence-index-input"
        />
        /{totalSentences}
      </div>
      <TypingEffect
        text={currentSentence.source?.replace(/[.?!]$/, '') ?? ''}
        onType={playSound}
        onComplete={handleComplete}
      />
      <div className="translation">
        {currentSentence.translation && currentSentence.translation.split(' - ').map((part, index) => (
          <span key={index}>
            {part}
            {index === 2 && lang === 'de' && (
              <FaVolumeUp 
                className="volume-icon"
                onClick={() => {
                  if (lang === 'de') {
                    const onlyDePart = part.replace(/\(.*?\)/g, '').trim();
                    const url = getAudioUrl(onlyDePart);
                    loadAudio(url)
                      .then(() => playAudio(url))
                      .catch(err => console.error('播放失败', err));
                  }
                }}
              />
            )}
            {index < 2 && ' - '}
          </span>
        ))}
      </div>
      {/* <StatsDisplay /> */}
      <div className="controls">
        {!isAutoPlaying && (
          <button className="auto-play-btn" onClick={startAutoPlay}>
            Auto Play
          </button>
        )}
        {isAutoPlaying && (
          <button className="stop-auto-play-btn" onClick={stopAutoPlay}>
            Stop
          </button>
        )}
      </div>
    </div>
  );
}
