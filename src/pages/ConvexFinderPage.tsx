import {
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { KonvaEventObject } from 'konva/lib/Node';
import { nanoid } from 'nanoid';
import { FC, useCallback, useMemo, useState } from 'react';
import { useDeepCompareEffect } from 'react-use';
import { CanvasWithExplorer } from '../components/CanvasWithExplorer';
import { CenteredMarginBox } from '../components/CenteredMarginBox';
import { DraggablePoint } from '../components/DraggablePoint';
import { GeometryObjectStorage } from '../components/GeometryObjectsExplorer';
import { PolygonObject } from '../components/PolygonObject';
import { mainPolygonKey, boxSize } from '../conf/geometryView';
import { roundPoint, Point, Polygon } from '../model/geometry';
import { ConvexAlgorithm, getConvex } from '../services/geometry';
import { useMovePointHandler } from '../utils/hooks';

// let id = 0;
const getNextId = () => nanoid();

const secondaryButton = 2;

type IsPointType = (arr: [string, unknown], ...rest: unknown[]) => boolean;

const isPoint: IsPointType = ([k]) => k.startsWith('point');

export const ConvexFinderPage: FC = () => {
  const [geometryObjects, setGeometryObjects] = useState<GeometryObjectStorage>(
    () => ({
      [mainPolygonKey]: { points: [] },
    })
  );

  const [algo, setAlgo] = useState<ConvexAlgorithm>(ConvexAlgorithm.Triangle);

  const handleAlgoChange = useCallback(
    (evt: SelectChangeEvent<ConvexAlgorithm>) => {
      setAlgo(evt.target.value as ConvexAlgorithm);
    },
    []
  );

  const handleMouseDownEvent = useCallback(
    (o: KonvaEventObject<MouseEvent>) => {
      const newPoint: Point = roundPoint(
        o.currentTarget.getRelativePointerPosition()
      );
      const id = getNextId();
      setGeometryObjects((geometryObjects) => ({
        ...geometryObjects,
        [`point-${id}`]: newPoint,
      }));
    },
    []
  );

  const handleMovePoint = useMovePointHandler(
    geometryObjects,
    setGeometryObjects
  );

  const handleClickPoint = useCallback(
    (id: string) => (o: KonvaEventObject<MouseEvent>) => {
      if (o.evt.button === secondaryButton) {
        setGeometryObjects(({ [id]: _, ...rest }) => ({ ...rest }));
      }
    },
    []
  );

  const points = useMemo(
    () =>
      Object.entries(geometryObjects)
        .filter(isPoint)
        .sort(([k1], [k2]) => k1.localeCompare(k2)),
    [geometryObjects]
  );

  useDeepCompareEffect(() => {
    const newPolygon = getConvex(
      points.map(([, v]) => v as Point),
      algo
    );
    setGeometryObjects((geometryObjects) => ({
      ...geometryObjects,
      [mainPolygonKey]: newPolygon,
    }));
  }, [points, algo]);

  return (
    <CenteredMarginBox>
      <Paper sx={{ p: 2, mb: 2, width: '800px' }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item>
            <FormControl fullWidth>
              <InputLabel id="algo-select-label">Алгоритм</InputLabel>
              <Select
                labelId="algo-select-label"
                id="algo-select"
                value={algo}
                label="Алгоритм"
                onChange={handleAlgoChange}
              >
                {Object.values(ConvexAlgorithm).map((a) => (
                  <MenuItem key={a} value={a}>
                    {a}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      <CanvasWithExplorer
        rectProps={{ onMouseDown: handleMouseDownEvent }}
        geometryObjects={geometryObjects}
      >
        <PolygonObject
          value={geometryObjects[mainPolygonKey] as Polygon}
          guidesSize={boxSize}
          lineProps={{
            onMouseDown: handleMouseDownEvent,
          }}
        />
        {points.map(([k, point]) => (
          <DraggablePoint
            key={k}
            point={point as Point}
            onClickPoint={handleClickPoint(k)}
            onMovePoint={(p) => handleMovePoint(k)(1, p)}
          />
        ))}
      </CanvasWithExplorer>
    </CenteredMarginBox>
  );
};
