// import correctSound from '../assets/sounds/correct.wav';
import wrongSound from '../assets/sounds/beep.wav';
import keySound from '../assets/sounds/click.wav';

const useTypingSound = () => {
  const playSound = (type) => {
    const audio = new Audio();
    switch(type) {
      case 'correct':
        audio.src = keySound;
        break;
      case 'wrong':
        audio.src = wrongSound;
        break;
      case 'key':
        audio.src = keySound;
        break;
      default:
        return;
    }
    audio.play();
  };

  return { playSound };
};

export default useTypingSound;
