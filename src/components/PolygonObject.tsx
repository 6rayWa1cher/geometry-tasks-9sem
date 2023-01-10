import { ComponentProps, FC, useCallback, useMemo } from 'react';
import { Line } from 'react-konva';
import { Point, Polygon } from '../model/geometry';
import { DraggablePoint } from './DraggablePoint';

export const PolygonObject: FC<{
  value: Polygon;
  guidesSize?: number;
  onMovePoint?: (i: number, point: Point) => void;
  lineProps?: ComponentProps<typeof Line>;
}> = ({ value, guidesSize, onMovePoint, lineProps }) => {
  const points = useMemo(
    () => value.points.flatMap(({ x, y }) => [x, y]),
    [value]
  );
  const handleMovePoint = useCallback(
    (i: number) => (p: Point) => onMovePoint?.(i, p),
    [onMovePoint]
  );

  return (
    <>
      <Line
        points={points}
        stroke="black"
        strokeWidth={1}
        closed
        {...lineProps}
      />
      {value.points.map((point, i) => (
        <DraggablePoint
          key={i}
          point={point}
          onMovePoint={onMovePoint != null ? handleMovePoint(i) : undefined}
          guidesSize={guidesSize}
        />
      ))}
    </>
  );
};
