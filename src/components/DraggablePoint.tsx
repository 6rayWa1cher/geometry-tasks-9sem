import { KonvaEventObject } from 'konva/lib/Node';
import { ComponentProps, FC, useCallback } from 'react';
import { Circle, Group, Rect } from 'react-konva';
import { Point, roundPoint } from '../model/geometry';

export const DraggablePoint: FC<{
  point: Point;
  onClickPoint?: (e: KonvaEventObject<MouseEvent>) => void;
  onMovePoint?: (point: Point) => void;
  guidesSize?: number;
  pointColor?: string;
  groupProps?: ComponentProps<typeof Group>;
}> = ({
  point,
  onClickPoint,
  onMovePoint,
  guidesSize = 11,
  pointColor = '#000000',
  groupProps,
}) => {
  const { x, y } = point;
  const offset = (guidesSize - 1) / 2;
  const handleDragMove = useCallback(
    (e: KonvaEventObject<DragEvent>) => {
      const newPoint = roundPoint({
        x: e.target.x() + offset,
        y: e.target.y() + offset,
      });
      onMovePoint?.(newPoint);
    },
    [offset, onMovePoint]
  );
  const hideGuide = onMovePoint == null;
  return (
    <Group
      x={x - offset}
      y={y - offset}
      width={guidesSize}
      height={guidesSize}
      draggable={onMovePoint != null}
      onClick={onClickPoint}
      onDragMove={handleDragMove}
      {...groupProps}
    >
      <Rect
        x={0}
        y={0}
        width={guidesSize}
        height={guidesSize}
        stroke={!hideGuide ? '#00FF00' : undefined}
        strokeWidth={!hideGuide ? 1 : undefined}
      />
      <Circle x={offset} y={offset} radius={2} fill={pointColor} />
    </Group>
  );
};
