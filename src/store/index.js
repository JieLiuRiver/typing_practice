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


export const pronunciationConfigAtom = atom({
  speed: 1.0,
  volume: 1.0,
  rate: 1.0,
  type: 'us',
  isLoop: false
});
