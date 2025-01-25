import { useEffect, useState, useMemo, useRef } from 'react';
import useSound from 'use-sound';
import { useAtomValue } from 'jotai';
import { pronunciationConfigAtom } from '@/store';
import { addHowlListener } from '@/utils/sound';

const pronunciationApi = 'https://dict.youdao.com/dictvoice?audio=';
export function generateWordSoundSrc(word, pronunciation) {
  switch (pronunciation) {
    case 'uk':
      return `${pronunciationApi}${word}&type=1`
    case 'us':
      return `${pronunciationApi}${word}&type=2`
    case 'zh':
      return `${pronunciationApi}${word}&le=zh`
    case 'de':
      return `${pronunciationApi}${word}&le=de`
    default:
      return ''
  }
}

export default function usePronunciationSound(word, isLoop) {
  const pronunciationConfig = useAtomValue(pronunciationConfigAtom)
  const loop = useMemo(() => (typeof isLoop === 'boolean' ? isLoop : pronunciationConfig.isLoop), [isLoop, pronunciationConfig.isLoop])
  const [isPlaying, setIsPlaying] = useState(false)

  const [play, { stop, sound }] = useSound(generateWordSoundSrc(word, pronunciationConfig.type), {
    html5: true,
    format: ['mp3'],
    loop,
    volume: pronunciationConfig.volume,
    rate: pronunciationConfig.rate,
    onloaderror: () => {
      console.error('Failed to load pronunciation audio');
    },
    onplayerror: () => {
      console.error('Failed to play pronunciation audio');
    },
  })

  useEffect(() => {
    if (!sound) return
    const unListens = []

    unListens.push(addHowlListener(sound, 'play', () => {
      setIsPlaying(true)
      console.log('Pronunciation started playing')
    }))
    unListens.push(addHowlListener(sound, 'end', () => {
      setIsPlaying(false)
      console.log('Pronunciation finished playing')
    }))
    unListens.push(addHowlListener(sound, 'pause', () => {
      setIsPlaying(false)
      console.log('Pronunciation paused')
    }))
    unListens.push(addHowlListener(sound, 'playerror', () => {
      setIsPlaying(false)
      console.error('Pronunciation playback error')
    }))

    return () => {
      setIsPlaying(false)
      unListens.forEach((unListen) => unListen())
      sound.unload()
    }
  }, [sound])

  return { play, stop, isPlaying }
}

export function usePrefetchPronunciationSound(word) {
  const pronunciationConfig = useAtomValue(pronunciationConfigAtom)

  useEffect(() => {
    if (!word) return

    const soundUrl = generateWordSoundSrc(word, pronunciationConfig.type)
    if (soundUrl === '') return

    const head = document.head
    const isPrefetch = Array.from(head.querySelectorAll('link[href]')).some((el) => el.href === soundUrl)

    if (!isPrefetch) {
      const audio = new Audio()
      audio.src = soundUrl
      audio.preload = 'auto'

      // gpt 说这这两行能尽可能规避下载插件被触发问题。 本地测试不加也可以，考虑到别的插件可能有问题，所以加上保险
      audio.crossOrigin = 'anonymous'
      audio.style.display = 'none'

      head.appendChild(audio)

      return () => {
        head.removeChild(audio)
      }
    }
  }, [pronunciationConfig.type, word])
}
