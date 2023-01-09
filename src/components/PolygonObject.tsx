import { LineConfig } from 'konva/lib/shapes/Line';
import { FC, useMemo } from 'react';
import { Line } from 'react-konva';
import { Polygon } from '../model/geometry';
import { GuideBox } from './GuideBox';

export const PolygonObject: FC<{
  value: Polygon;
  props?: LineConfig;
  showGuides?: boolean;
  guidesSize?: number;
}> = ({ props, value, showGuides = false, guidesSize }) => {
  const points = useMemo(
    () => value.points.flatMap(({ x, y }) => [x, y]),
    [value]
  );
  return (
    <>
      <Line points={points} stroke="black" strokeWidth={1} closed {...props} />
      {showGuides &&
        value.points.map((point, i) => (
          <GuideBox key={i} point={point} guideSize={guidesSize} />
        ))}
    </>
  );
};
