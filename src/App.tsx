import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LocalizePointPage } from './pages/LocalizePointPage';
import { Dashboard } from './components/DashboardFrame';
import { MainPage } from './pages/MainPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: 'localize-point',
        element: <LocalizePointPage />,
      },
    ],
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
