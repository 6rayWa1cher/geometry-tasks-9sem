import { useCallback } from 'react';
import { GeometryObjectStorage } from '../components/GeometryObjectsExplorer';
import { Point, setPoint } from '../model/geometry';

export const useMovePointHandler = (
  geometryObjects: GeometryObjectStorage,
  setGeometryObjects: (geometryObjects: GeometryObjectStorage) => void
) => {
  const handleMovePoint = useCallback(
    (obj: string) => (i: number, point: Point) => {
      const polygon = geometryObjects[obj];
      const newPolygon = setPoint(i, polygon, point);
      setGeometryObjects({
        ...geometryObjects,
        [obj]: newPolygon,
      });
    },
    [geometryObjects, setGeometryObjects]
  );

  return handleMovePoint;
};
