import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HistoryIcon from '@mui/icons-material/History';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SettingsIcon from '@mui/icons-material/Settings';
import ClassIcon from '@mui/icons-material/Class';
import TaskIcon from '@mui/icons-material/Task';
import ComputerIcon from '@mui/icons-material/Computer';
import PeopleIcon from '@mui/icons-material/People';

export const mainListItems = (
  <div>
    <ListItem button component={Link} to="/">
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <ListItemText primary="Главная" />
    </ListItem>
    <ListItem button component={Link} to="/history">
      <ListItemIcon>
        <HistoryIcon />
      </ListItemIcon>
      <ListItemText primary="История игр" />
    </ListItem>
    <ListItem button component={Link} to="/leaderboard">
      <ListItemIcon>
        <EmojiEventsIcon />
      </ListItemIcon>
      <ListItemText primary="Таблица рекордов" />
    </ListItem>
  </div>
);

export const adminListItems = (
  <>
    <ListItem button component={Link} to="/employees">
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Пользователи" />
    </ListItem>
    <ListItem button component={Link} to="/shared-users">
      <ListItemIcon>
        <ComputerIcon />
      </ListItemIcon>
      <ListItemText primary="Компьютеры" />
    </ListItem>
  </>
);

export const teacherListItems = (
  <ListItem button component={Link} to="/packages">
    <ListItemIcon>
      <TaskIcon />
    </ListItemIcon>
    <ListItemText primary="Посылки" />
  </ListItem>
);

export const secondaryListItems = (
  <ListItem button component={Link} to="/settings">
    <ListItemIcon>
      <SettingsIcon />
    </ListItemIcon>
    <ListItemText primary="Настройки" />
  </ListItem>
);
