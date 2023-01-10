import { Box } from '@mui/system';
import { FC } from 'react';

export const CenteredMarginBox: FC<{
  children: Children;
}> = ({ children }) => (
  <Box
    sx={{
      mt: 8,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}
  >
    {children}
  </Box>
);
