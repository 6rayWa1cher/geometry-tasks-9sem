import { LocalizePointPage } from '../pages/LocalizePointPage';
import { GeneratePolygonPage } from '../pages/GeneratePolygonPage';

export const tasksList = [
  {
    num: [1],
    to: '/localize-point',
    label: 'Локализация точки лучём',
    element: <LocalizePointPage />,
  },
  {
    num: [2],
    to: '/generate-polygon',
    label: 'Генерация полигона',
    element: <GeneratePolygonPage />,
  },
];
