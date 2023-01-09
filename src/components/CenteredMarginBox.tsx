import { Box } from '@mui/system';
import { FC } from 'react';

const CenteredMarginBox: FC<{
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

export default CenteredMarginBox;
