import { Box, Typography, Slider } from '@mui/material';
import { FC } from 'react';

export const SliderWithLabel: FC<{
  label: string;
  min: number;
  max: number;
  value: number | number[];
  onChange: (value: number | number[]) => void;
}> = ({ label, min, max, value, onChange }) => (
  <Box sx={{ width: 250 }}>
    <Typography gutterBottom>{label}</Typography>
    <Slider
      value={value}
      min={min}
      max={max}
      valueLabelDisplay="auto"
      onChange={(_, value) => onChange(value)}
    />
  </Box>
);
