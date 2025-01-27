import { createHashRouter } from 'react-router-dom';
import App from './App';
import LangApp from './pages/LangApp';

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/:lang',
    element: <LangApp />,
  },
]);

export default router;
