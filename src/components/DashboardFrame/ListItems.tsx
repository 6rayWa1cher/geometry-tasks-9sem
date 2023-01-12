import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import { ListItemButton } from '@mui/material';
import { tasksList } from '../../conf/tasks';

export const listItems = tasksList.map(({ num, to, label }, i) => (
  <ListItemButton key={to} component={Link} to={to}>
    <ListItemText primary={label} secondary={num.join(', ')} />
  </ListItemButton>
));
