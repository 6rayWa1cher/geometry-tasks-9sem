import { FC, ComponentProps } from 'react';
import { Layer, Rect, Stage } from 'react-konva';
import { canvasWidth, canvasHeight } from '../conf/geometryView';

export const Canvas: FC<{
  width?: number;
  height?: number;
  rectProps?: ComponentProps<typeof Rect>;
  children?: Children;
}> = ({ rectProps, width = canvasWidth, height = canvasHeight, children }) => {
  return (
    <Stage
      width={width}
      height={height}
      onContextMenu={(e) => {
        e.evt.preventDefault();
        e.evt.stopPropagation();
        return false;
      }}
    >
      <Layer>
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          stroke="black"
          strokeWidth={2}
          fill="#FFFFFF"
          {...rectProps}
        />
        {children}
      </Layer>
    </Stage>
  );
};
