import { useAtomValue } from 'jotai';
import { useParams } from 'react-router-dom';
import { pronunciationConfigAtom } from '../store';

const ConfigPage = () => {
  const { lang } = useParams();
  const config = useAtomValue(pronunciationConfigAtom);

  return (
    <div>
      <h1>{lang.toUpperCase()} Pronunciation Settings</h1>
      <p>Current pronunciation type: {config.type}</p>
    </div>
  );
};

export default ConfigPage;
