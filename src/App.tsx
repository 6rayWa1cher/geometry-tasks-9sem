import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Dashboard } from './components/DashboardFrame';
import { MainPage } from './pages/MainPage';
import { tasksList } from './conf/tasks';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      ...tasksList.map(({ to, element }) => ({ path: to, element })),
    ],
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
