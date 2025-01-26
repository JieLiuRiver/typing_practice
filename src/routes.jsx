import { createHashRouter } from 'react-router-dom';
import App from './App';
import ConfigPage from './pages/ConfigPage';

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/:lang',
    element: <ConfigPage />,
  },
]);

export default router;
