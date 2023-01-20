import { LocalizePointPage } from '../pages/LocalizePointPage';
import { GeneratePolygonPage } from '../pages/GeneratePolygonPage';
import { ConvexFinderPage } from '../pages/ConvexFinderPage';

export const tasksList = [
  {
    num: [1],
    to: '/localize-point',
    label: 'Локализация точки лучём',
    element: <LocalizePointPage />,
  },
  {
    num: [2, 3, 4],
    to: '/generate-polygon',
    label: 'Генерация полигона',
    element: <GeneratePolygonPage />,
  },
  {
    num: [9, 10, 12],
    to: '/convex-finder',
    label: 'Нахождение выпуклой оболочки',
    element: <ConvexFinderPage />,
  },
];
