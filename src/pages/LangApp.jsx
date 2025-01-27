import { useParams } from 'react-router-dom';
import TypingContainer from '../components/TypingContainer';

const LangApp = () => {
  const { lang } = useParams();

  return (
    <TypingContainer lang={lang} />
  );
};

export default LangApp;
