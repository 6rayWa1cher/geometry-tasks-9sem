import { KonvaEventObject } from 'konva/lib/Node';
import { FC, useCallback, useState } from 'react';
import { PolygonObject } from '../components/PolygonObject';
import {
  getPoints,
  Point,
  Polygon,
  roundPoint,
  setPoint,
} from '../model/geometry';
import { CenteredMarginBox } from '../components/CenteredMarginBox';
import { DraggablePoint } from '../components/DraggablePoint';
import { isPointInPolygon } from '../services/geometry';
import { useAsync } from 'react-use';
import { GeometryObjectStorage } from '../components/GeometryObjectsExplorer';
import {
  mainPolygonKey,
  testPointKey,
  canvasWidth,
  canvasHeight,
  boxSize,
} from '../conf/geometryView';
import { useMovePointHandler } from '../utils/hooks';
import { CanvasWithExplorer } from '../components/CanvasWithExplorer';

const TestPoint: FC<{
  geometryObjects: GeometryObjectStorage;
  onMovePoint: (p: Point) => void;
}> = ({ geometryObjects, onMovePoint }) => {
  const pointInPolygon = useAsync(async () => {
    const polygon = geometryObjects[mainPolygonKey] as Polygon;
    const point = geometryObjects[testPointKey] as Point;
    return isPointInPolygon(polygon, point);
  }, [geometryObjects]);

  return (
    <DraggablePoint
      point={geometryObjects[testPointKey] as Point}
      onMovePoint={onMovePoint}
      pointColor={pointInPolygon.value ?? false ? '#00FF00' : '#FF0000'}
    />
  );
};

export const LocalizePointPage: FC = () => {
  const [geometryObjects, setGeometryObjects] = useState<GeometryObjectStorage>(
    () => ({
      [mainPolygonKey]: { points: [] },
      [testPointKey]: roundPoint({ x: canvasWidth / 2, y: canvasHeight / 2 }),
    })
  );

  const handleMouseDownEvent = useCallback(
    (o: KonvaEventObject<MouseEvent>) => {
      const newPoint: Point = roundPoint(
        o.currentTarget.getRelativePointerPosition()
      );
      const polygon = geometryObjects[mainPolygonKey];
      const newPolygon = setPoint(getPoints(polygon).length, polygon, newPoint);
      setGeometryObjects((geometryObjects) => ({
        ...geometryObjects,
        [mainPolygonKey]: newPolygon,
      }));
    },
    [geometryObjects]
  );

  const handleMovePoint = useMovePointHandler(
    geometryObjects,
    setGeometryObjects
  );

  return (
    <CenteredMarginBox>
      <CanvasWithExplorer
        rectProps={{ onMouseDown: handleMouseDownEvent }}
        geometryObjects={geometryObjects}
      >
        <PolygonObject
          value={geometryObjects[mainPolygonKey] as Polygon}
          guidesSize={boxSize}
          onMovePoint={handleMovePoint(mainPolygonKey)}
          lineProps={{
            onMouseDown: handleMouseDownEvent,
          }}
        />
        <TestPoint
          geometryObjects={geometryObjects}
          onMovePoint={(p) => handleMovePoint(testPointKey)(0, p)}
        />
      </CanvasWithExplorer>
    </CenteredMarginBox>
  );
};
