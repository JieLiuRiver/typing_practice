import { atom } from 'jotai';
import sentencesData from './sentences.json';

// Store for sentences loaded from JSON
export const sentencesAtom = atom(sentencesData);

// Current sentence index
export const currentIndexAtom = atom(0);

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
