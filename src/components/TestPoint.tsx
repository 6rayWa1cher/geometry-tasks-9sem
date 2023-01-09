import { FC } from 'react';
import { Circle } from 'react-konva';
import { Point } from '../model/geometry';
import { GuideBox } from './GuideBox';

export const TestPoint: FC<{
  point: Point;
  showGuide?: boolean;
  guideSize?: number;
  fill?: string;
}> = ({ point, showGuide = true, guideSize, fill }) => {
  const { x, y } = point;
  return (
    <>
      <GuideBox point={{ x, y }} guideSize={guideSize} hide={!showGuide} />
      <Circle x={x} y={y} radius={2} fill={fill ?? '#000000'} />
    </>
  );
};
