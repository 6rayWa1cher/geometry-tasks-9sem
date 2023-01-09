import { FC } from 'react';
import { Rect } from 'react-konva';
import { Point } from '../model/geometry';

export const GuideBox: FC<{
  point: Point;
  guideSize?: number;
  hide?: boolean;
}> = ({ point, guideSize = 11, hide = false }) => {
  const { x, y } = point;
  const guideShift = (guideSize - 1) / 2;
  return (
    <Rect
      x={x - guideShift}
      y={y - guideShift}
      width={guideSize}
      height={guideSize}
      stroke={!hide ? '#00FF00' : undefined}
      strokeWidth={!hide ? 1 : undefined}
    />
  );
};
