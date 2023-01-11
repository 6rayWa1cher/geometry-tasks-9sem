import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import { Avatar, ListItemAvatar, ListItemButton } from '@mui/material';
import { tasksList } from '../../conf/tasks';

export const listItems = tasksList.map(({ num, to, label }, i) => (
  <ListItemButton key={to} component={Link} to={to}>
    <ListItemAvatar>
      <Avatar>{num.map((n) => +n).join(',')}</Avatar>
    </ListItemAvatar>
    <ListItemText primary={label} />
  </ListItemButton>
));
