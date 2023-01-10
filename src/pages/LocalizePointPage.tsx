import { KonvaEventObject } from 'konva/lib/Node';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import { PolygonObject } from '../components/PolygonObject';
import {
  GeometryObject,
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

const mainPolygonKey = 'mainPolygon';

const testPointKey = 'testPoint';

const boxSize = 11;

const canvasWidth = 800;

const canvasHeight = 600;

type GeometryObjectStorage = {
  [key: string]: GeometryObject;
};

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

  const points = useMemo(
    () =>
      Object.entries(geometryObjects).flatMap(([key, value]) =>
        getPoints(value).map((p, i): [string, number, Point] => [key, i, p])
      ),
    [geometryObjects]
  );

  useEffect(
    () => console.debug(points.flatMap(([, , { x, y }]) => [x, y])),
    [points]
  );

  const handleMouseDownEvent = useCallback(
    (o: KonvaEventObject<MouseEvent>) => {
      const newPoint: Point = roundPoint(
        o.currentTarget.getRelativePointerPosition()
      );
      const polygon = geometryObjects[mainPolygonKey];
      const newPolygon = setPoint(getPoints(polygon).length, polygon, newPoint);
      setGeometryObjects({
        ...geometryObjects,
        [mainPolygonKey]: newPolygon,
      });
    },
    [geometryObjects]
  );

  const handleMovePoint = useCallback(
    (obj: string) => (i: number, point: Point) => {
      const polygon = geometryObjects[obj];
      const newPolygon = setPoint(i, polygon, point);
      setGeometryObjects({
        ...geometryObjects,
        [obj]: newPolygon,
      });
    },
    [geometryObjects]
  );

  const pointInPolygon = useAsync(async () => {
    const polygon = geometryObjects[mainPolygonKey] as Polygon;
    const point = geometryObjects[testPointKey] as Point;
    return isPointInPolygon(polygon, point);
  }, [geometryObjects]);

  return (
    <CenteredMarginBox>
      <Stage width={canvasWidth} height={canvasHeight}>
        <Layer>
          <Rect
            x={0}
            y={0}
            width={canvasWidth}
            height={canvasHeight}
            stroke="black"
            strokeWidth={4}
            fill="#FFFFFF"
            onMouseDown={handleMouseDownEvent}
          />
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
        </Layer>
      </Stage>
    </CenteredMarginBox>
  );
};
