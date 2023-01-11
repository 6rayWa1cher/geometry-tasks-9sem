import {
  Paper,
  Grid,
  IconButton,
  FormControlLabel,
  FormGroup,
  Switch,
} from '@mui/material';
import { FC, useCallback, useEffect, useState } from 'react';
import { CanvasWithExplorer } from '../components/CanvasWithExplorer';
import { CenteredMarginBox } from '../components/CenteredMarginBox';
import { GeometryObjectStorage } from '../components/GeometryObjectsExplorer';
import { PolygonObject } from '../components/PolygonObject';
import {
  mainPolygonKey,
  boxSize,
  canvasWidth,
  canvasHeight,
} from '../conf/geometryView';
import { Polygon, roundPoint } from '../model/geometry';
import RefreshIcon from '@mui/icons-material/Refresh';
import { SliderWithLabel } from '../components/SliderWithLabel';
import { generateConvexPolygon, generatePolygon } from '../services/geometry';

export const GeneratePolygonPage: FC = () => {
  const [geometryObjects, setGeometryObjects] = useState<GeometryObjectStorage>(
    () => ({
      [mainPolygonKey]: { points: [] },
    })
  );

  const [gradBounds, setGradBounds] = useState<[number, number]>([1, 360]);

  const handleGradBoundsChange = useCallback(
    (value: number | number[]) => setGradBounds(value as [number, number]),
    [setGradBounds]
  );

  const [radBounds, setRadBounds] = useState<[number, number]>([0, 300]);

  const handleRadBoundsChange = useCallback(
    (value: number | number[]) => setRadBounds(value as [number, number]),
    [setRadBounds]
  );

  const [convex, setConvex] = useState(false);

  const handleConvexChange = useCallback(
    (_: unknown, value: boolean) => setConvex(value),
    [setConvex]
  );

  const refreshPolygon = useCallback(() => {
    const generator = convex ? generateConvexPolygon : generatePolygon;
    const polygon = generator({
      radBounds,
      gradBounds,
      center: roundPoint({ x: canvasWidth / 2, y: canvasHeight / 2 }),
    });
    setGeometryObjects({
      ...geometryObjects,
      [mainPolygonKey]: polygon,
    });
  }, [convex, geometryObjects, gradBounds, radBounds]);

  useEffect(
    () => {
      refreshPolygon();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gradBounds[0], gradBounds[1], radBounds[0], radBounds[1], convex]
  );

  return (
    <CenteredMarginBox>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item>
            <IconButton onClick={refreshPolygon}>
              <RefreshIcon />
            </IconButton>
          </Grid>
          <Grid item xs>
            <SliderWithLabel
              label="Интервал для углов"
              min={1}
              max={360}
              value={gradBounds}
              onChange={handleGradBoundsChange}
            />
          </Grid>
          <Grid item xs>
            <SliderWithLabel
              label="Интервал для радиусов"
              min={0}
              max={300}
              value={radBounds}
              onChange={handleRadBoundsChange}
            />
          </Grid>
          <Grid item>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch checked={convex} onChange={handleConvexChange} />
                }
                label="Выпуклый"
              />
            </FormGroup>
          </Grid>
        </Grid>
      </Paper>
      <CanvasWithExplorer geometryObjects={geometryObjects}>
        <PolygonObject
          value={geometryObjects[mainPolygonKey] as Polygon}
          guidesSize={boxSize}
        />
      </CanvasWithExplorer>
    </CenteredMarginBox>
  );
};
