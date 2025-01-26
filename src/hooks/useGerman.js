import { useCallback, useRef, useEffect } from 'react';
import Base64 from '../utils/base64';

// 缓存配置
const CACHE_TTL = 1000 * 60 * 60; // 1小时
const MAX_CACHE_SIZE = 100; // 最大缓存数量

// 缓存清理函数
const cleanupCache = (cache) => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
  if (cache.size > MAX_CACHE_SIZE) {
    const oldestKey = [...cache.keys()][0];
    cache.delete(oldestKey);
  }
};

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
  const urlCache = useRef(new Map());
  const audioCache = useRef(new Map());

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
    const cacheKey = `${lang}:${text}`;
    
    // 检查缓存
    if (urlCache.current.has(cacheKey)) {
      return urlCache.current.get(cacheKey).url;
    }

    const encodedText = fixedEncodeURIComponent(Base64.encode(text));
    const url = `https://api.frdic.com/api/v2/speech/speakweb?langid=${lang}&txt=QYN${encodedText}`;
    
    // 更新缓存
    urlCache.current.set(cacheKey, {
      url,
      timestamp: Date.now()
    });
    cleanupCache(urlCache.current);
    
    return url;
  }, [fixedEncodeURIComponent]);

  /**
   * 加载音频
   * @param {string} url - 音频URL
   * @returns {Promise<void>}
   */
  const loadAudio = useCallback((url) => {
    // 检查缓存
    if (audioCache.current.has(url)) {
      const cachedAudio = audioCache.current.get(url);
      audioRef.current = cachedAudio.audio;
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.src = url;
      audio.preload = 'auto';
      audioRef.current = audio;
      
      audio.addEventListener('canplaythrough', () => {
        // 更新缓存
        audioCache.current.set(url, {
          audio,
          timestamp: Date.now()
        });
        cleanupCache(audioCache.current);
        resolve();
      });
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

  // 组件卸载时清理缓存
  useEffect(() => {
    return () => {
      urlCache.current.clear();
      audioCache.current.clear();
    };
  }, []);

  return {
    getEncodedDataRel,
    getAudioUrl,
    loadAudio,
    playAudio
  };
}

export default useGerman;
