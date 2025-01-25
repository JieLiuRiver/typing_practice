import { atom } from 'jotai';
import sentences01Data from '../assets/sentences/01.json';
import sentences02Data from '../assets/sentences/02.json';

// Typing state management
export const isRunningAtom = atom(false);

// Store for sentences loaded from JSON
export const sentencesAtom = atom([...sentences02Data, ...sentences01Data]);

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
    return sentences[index % sentences.length];
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


// Base config without type
const basePronunciationConfigAtom = atom({
  speed: 1.0,
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
