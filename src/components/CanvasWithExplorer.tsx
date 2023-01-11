import { Box, Divider } from '@mui/material';
import { ComponentProps, FC } from 'react';
import { canvasWidth } from '../conf/geometryView';
import { Canvas } from './Canvas';
import {
  GeometryObjectsExplorer,
  GeometryObjectStorage,
} from './GeometryObjectsExplorer';

export const CanvasWithExplorer: FC<
  {
    geometryObjects: GeometryObjectStorage;
  } & ComponentProps<typeof Canvas>
> = ({ geometryObjects, ...rest }) => {
  return (
    <>
      <Canvas {...rest} />
      <Box sx={{ height: 400, width: rest.width ?? canvasWidth }}>
        <Divider sx={{ pt: 2, mb: 2 }} variant="middle" />
        <GeometryObjectsExplorer geometryObjects={geometryObjects} />
      </Box>
    </>
  );
};
