import { atom } from 'jotai';
import enWords from '../assets/BNC_COCA_lists.json';
// import enWords from '../assets/en-words.json';
// import deSentences from '../assets/de-sentences.json';
import deWords from '../assets/de-words.json';

const savedContentType = localStorage.getItem(`contentType`) || 'words';
// Content type (sentences or words)
export const contentTypeAtom = atom(savedContentType);

// Typing state management
export const isRunningAtom = atom(true);

// Store for sentences loaded from JSON
// Get initial language from URL
const getInitialLanguage = () => {
  const url = window.location.href;
  return url.includes('/de') ? 'de' : 'us';
};

export const sentencesAtom = atom(
  (get) => {
    const contentType = get(contentTypeAtom);
    const language = getInitialLanguage();

    const words = language === 'de' ? deWords : enWords;
    // const sentences = language === 'de'? deSentences : enSentences;
    const newSentences = words.map(word => {
      const list = typeof word !== 'string' ? word.translation.split(' - ') : []
      return {
        source: typeof word === 'string' ? word : list[list.length - 1],
        translation: `${typeof word === 'string' ? '' : list[0]} - ${list[1]}`
      }
    })
    return contentType === 'sentences' ? newSentences : words;
  }
);

const lastTimeIndex = Number(localStorage.getItem(`lastTimeIndex`) || 0);

// Current sentence index with random initial value
export const currentIndexAtom = atom(
  lastTimeIndex
);

// Derived atom to get current sentence
export const currentSentenceAtom = atom(
  (get) => {
    const sentences = get(sentencesAtom);
    const index = get(currentIndexAtom);
    return sentences[index >= sentences.length ? 0 : index];
  }
);

// Action atom to advance to next sentence
export const nextSentenceAtom = atom(
  null,
  (get, set) => {
    const sentences = get(sentencesAtom);
    const currentIndex = get(currentIndexAtom);
    const newIndex = (currentIndex + 1) % sentences.length;
    localStorage.setItem(`lastTimeIndex`, newIndex);
    set(currentIndexAtom, newIndex);
  }
);

// Action atom to advance to next sentence
export const prevSentenceAtom = atom(
  null,
  (get, set) => {
    const sentences = get(sentencesAtom);
    const currentIndex = get(currentIndexAtom);
    const newIndex = (currentIndex - 1) % sentences.length;
    localStorage.setItem(`lastTimeIndex`, newIndex);
    set(currentIndexAtom, newIndex);
  }
);

// Base config without type
const basePronunciationConfigAtom = atom({
  speed: 1.2,
  volume: 1.0,
  rate: 1.0,
  isLoop: false
});

// Current language type atom
export const pronunciationTypeAtom = atom('us');

// Derived config atom that combines base config with current type
export const pronunciationConfigAtom = atom(
  (get) => ({
    ...get(basePronunciationConfigAtom),
    type: get(pronunciationTypeAtom)
  }),
  (get, set, update) => {
    if (typeof update === 'string') {
      // Only updating type
      set(pronunciationTypeAtom, update);
    } else {
      // Updating other config values
      set(basePronunciationConfigAtom, update);
    }
  }
);
