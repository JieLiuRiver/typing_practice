import { useCallback, useRef } from 'react';
import Base64 from '../utils/base64';

/**
 * 自定义Hook：useGerman
 * @returns {{
 *   getEncodedDataRel: (lang: string, text: string) => string,
 *   getAudioUrl: (lang: string, text: string) => string,
 *   loadAudio: (url: string) => Promise<void>,
 *   playAudio: (url: string) => void
 * }}
 */
function useGerman() {
  const audioRef = useRef(null);

  /**
   * 获取编码后的data-rel属性值
   * @param {string} lang - 语言标识
   * @param {string} text - 要编码的文本
   * @returns {string} 编码后的data-rel值
   */
  const getEncodedDataRel = useCallback((lang, text) => {
    const encodedText = fixedEncodeURIComponent(Base64.encode(text));
    return `langid=${lang}&txt=QYN${encodedText}`;
  }, []);

  /**
   * 对URI组件进行安全编码
   * @param {string} str - 要编码的字符串
   * @returns {string} 编码后的字符串
   */
  const fixedEncodeURIComponent = useCallback((str) => {
    return encodeURIComponent(str)
      .replace(/[!'()]/g, escape)
      .replace(/\*/g, "%2A");
  }, []);

  /**
   * 获取音频URL
   * @param {string} lang - 语言标识
   * @param {string} text - 要发音的文本
   * @returns {string} 音频URL
   */
  const getAudioUrl = useCallback((lang, text) => {
    const encodedText = fixedEncodeURIComponent(Base64.encode(text));
    return `https://api.frdic.com/api/v2/speech/speakweb?langid=${lang}&txt=QYN${encodedText}`;
  }, [fixedEncodeURIComponent]);

  /**
   * 加载音频
   * @param {string} url - 音频URL
   * @returns {Promise<void>}
   */
  const loadAudio = useCallback((url) => {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.src = url;
      audio.preload = 'auto';
      audioRef.current = audio;
      
      audio.addEventListener('canplaythrough', () => resolve());
      audio.addEventListener('error', (err) => reject(err));
    });
  }, []);

  /**
   * 播放音频
   * @param {string} url - 音频URL
   */
  const playAudio = useCallback((url) => {
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play();
    }
  }, []);

  return {
    getEncodedDataRel,
    getAudioUrl,
    loadAudio,
    playAudio
  };
}

export default useGerman;
