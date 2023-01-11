import { Grid, Slider, Input, Box, Typography } from '@mui/material';
import { toNumber } from 'lodash';
import { FC, useCallback } from 'react';

export const SliderWithInput: FC<{
  label?: string;
  value?: number;
  min: number;
  max: number;
  step?: number;
  onValueChanged?: (value: number) => void;
}> = ({ label, min, max, value = min, step, onValueChanged }) => {
  const handleSliderChange = useCallback(
    (_: unknown, value: number | number[]) => {
      onValueChanged?.(value as number);
    },
    [onValueChanged]
  );
  const handleInputChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = useCallback(
    (e) => {
      onValueChanged?.(toNumber(e.target.value));
    },
    [onValueChanged]
  );
  return (
    <Box sx={{ width: 250 }}>
      {label && <Typography gutterBottom>{label}</Typography>}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider value={value} onChange={handleSliderChange} />
        </Grid>
        <Grid item>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            inputProps={{
              step: step ?? Math.round(Math.abs(max - min) / 10),
              min,
              max,
              type: 'number',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
