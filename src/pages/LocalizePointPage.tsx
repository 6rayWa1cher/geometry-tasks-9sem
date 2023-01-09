import { KonvaEventObject } from 'konva/lib/Node';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import CenteredMarginBox from '../components/CenteredMarginBox';
import { PolygonObject } from '../components/PolygonObject';
import {
  GeometryObject,
  getPoints,
  Point,
  Polygon,
  roundPoint,
  setPoint,
} from '../model/geometry';
import { findLast } from 'lodash';
import { GuideBox } from '../components/GuideBox';

enum MouseState {
  NotClicked,
  ClickedLeft,
  ClickedRight,
  Dragging,
}

const mainPolygonKey = 'mainPolygon';

const testPointKey = 'testPoint';

const boxSize = 11;

const canvasWidth = 800;

const canvasHeight = 600;

export const LocalizePointPage: FC = () => {
  const [geometryObjects, setGeometryObjects] = useState<{
    [key: string]: GeometryObject;
  }>(() => ({
    [mainPolygonKey]: { points: [] },
    [testPointKey]: roundPoint({ x: canvasWidth / 2, y: canvasHeight / 2 }),
  }));

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

  const [mouseState, setMouseState] = useState<MouseState>(
    MouseState.NotClicked
  );

  const [selectedPoint, setSelectedPoint] = useState<number>();
  const [selectedObject, setSelectedObject] = useState<string>();
  const handleMouseDownEvent = useCallback(
    (o: KonvaEventObject<MouseEvent>) => {
      const newPoint: Point = roundPoint(
        o.currentTarget.getRelativePointerPosition()
      );
      const foundEntry = findLast(
        points,
        ([, , { x, y }]) =>
          Math.abs(x - newPoint.x) <= boxSize &&
          Math.abs(y - newPoint.y) <= boxSize
      );

      let foundPoint, foundObject;

      if (foundEntry != null) {
        foundObject = foundEntry[0];
        foundPoint = foundEntry[1];
      } else {
        const polygon = geometryObjects[mainPolygonKey];
        const newPolygon = setPoint(
          getPoints(polygon).length,
          polygon,
          newPoint
        );
        setGeometryObjects({
          ...geometryObjects,
          [mainPolygonKey]: newPolygon,
        });
        foundObject = mainPolygonKey;
        foundPoint = getPoints(newPolygon).length - 1;
      }

      setSelectedObject(foundObject);
      setSelectedPoint(foundPoint);
    },
    [geometryObjects, points]
  );

  const handleMouseMoveEvent = useCallback(
    (o: KonvaEventObject<MouseEvent>) => {
      if (selectedObject == null || selectedPoint == null) return;
      const polygon = geometryObjects[selectedObject];
      const newPoint: Point = roundPoint(
        o.currentTarget.getRelativePointerPosition()
      );
      const newPolygon = setPoint(selectedPoint, polygon, newPoint);
      setGeometryObjects({
        ...geometryObjects,
        [selectedObject]: newPolygon,
      });
    },
    [geometryObjects, selectedObject, selectedPoint]
  );

  const handleMouseUpEvent = useCallback((o: KonvaEventObject<MouseEvent>) => {
    setSelectedObject(undefined);
    setSelectedPoint(undefined);
  }, []);

  return (
    <CenteredMarginBox>
      <Stage width={canvasWidth} height={canvasHeight}>
        <Layer
          onMouseDown={handleMouseDownEvent}
          onMouseMove={handleMouseMoveEvent}
          onMouseLeave={handleMouseUpEvent}
          onMouseUp={handleMouseUpEvent}
        >
          <Rect
            x={0}
            y={0}
            width={canvasWidth}
            height={canvasHeight}
            stroke="black"
            strokeWidth={4}
            fill="#FFFFFF"
          />
          <PolygonObject
            value={geometryObjects[mainPolygonKey] as Polygon}
            guidesSize={boxSize}
            showGuides
          />
          <GuideBox
        </Layer>
      </Stage>
    </CenteredMarginBox>
  );
};
