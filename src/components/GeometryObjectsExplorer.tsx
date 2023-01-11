import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { FC, useMemo } from 'react';
import { GeometryObject } from '../model/geometry';

export type GeometryObjectStorage = {
  [key: string]: GeometryObject;
};

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'value', headerName: 'Значение', flex: 1 },
];

export const GeometryObjectsExplorer: FC<{
  geometryObjects: GeometryObjectStorage;
}> = ({ geometryObjects }) => {
  const rows = useMemo(
    () =>
      Object.entries(geometryObjects).map(([k, v]) => ({
        id: k,
        value: JSON.stringify(v),
      })),
    [geometryObjects]
  );
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pageSize={10}
      rowsPerPageOptions={[10]}
      getRowHeight={() => 'auto'}
    />
  );
};
