import { atom } from 'jotai';
import sentencesData from './sentences.json';

// Store for sentences loaded from JSON
export const sentencesAtom = atom(sentencesData.sentences);

// Derived atom to get a random sentence with translation
export const currentSentenceAtom = atom((get) => {
  const sentences = get(sentencesAtom);
  return sentences[Math.floor(Math.random() * sentences.length)];
});

export const pronunciationConfigAtom = atom({
  speed: 1.0,
  volume: 1.0,
  rate: 1.0,
  type: 'us',
  isLoop: false
});
