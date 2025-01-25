import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import sentences01Data from '../assets/sentences/01.json';

// Typing state management
export const isRunningAtom = atom(false);

// Store for sentences loaded from JSON
export const sentencesAtom = atom(sentences01Data);

// Current sentence index with localStorage persistence
export const currentIndexAtom = atomWithStorage('currentIndex', 0);

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
    set(currentIndexAtom, (currentIndex + 1) % sentences.length);
  }
);


export const pronunciationConfigAtom = atom({
  speed: 1.0,
  volume: 1.0,
  rate: 1.0,
  type: 'us',
  isLoop: false
});
