import { useState, useCallback } from "react";
import { styled, useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import type { TypographyProps } from "@mui/material/Typography";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  adminListItems,
  secondaryListItems,
  teacherListItems,
} from "./ListItems";
import { Outlet, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { useMediaQuery } from "@mui/material";
import { HomeButton } from "../buttons/HomeButton";

const Copyright = (props: TypographyProps) => {
  const yearRange = (() => {
    const yearOfProduction = 2022;
    const currentYear = new Date().getFullYear();
    return yearOfProduction === currentYear
      ? currentYear
      : `${yearOfProduction}-${currentYear}`;
  })();
  return (
    <Typography variant="body2" color="text.secondary" {...props}>
      {"Сделано 6rayWa1cher, "}
      {yearRange}
      {"."}
    </Typography>
  );
};

const LogoutButton = () => {
  const navigate = useNavigate();

  const onClick = useCallback(() => {
    navigate("/logout");
  }, [navigate]);

  return (
    <IconButton aria-label="logout" color="inherit" onClick={onClick}>
      <LogoutIcon />
    </IconButton>
  );
};

const drawerWidth = 240;

interface AppBarProps {
  open: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflow: "hidden",
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(0),
    }),
  },
}));

export interface DashboardFrameProps {
  children: Children;
}

const DashboardContent = ({ children }: DashboardFrameProps) => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const theme = useTheme();
  const largeScreen = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          {/* <PathBreadcrumb largeScreen={largeScreen} sx={{ flexGrow: 1 }} /> */}
          <Box sx={{ flexGrow: 1 }}>
            <HomeButton />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Container sx={{ width: drawerWidth }} disableGutters>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          {/* {role != null && (
            <>
              <List>
                {role === Role.ADMIN && adminListItems}
                {role === Role.TEACHER && teacherListItems}
              </List>
              <Divider />
              <List>{secondaryListItems}</List>
              <Divider />
            </>
          )} */}
          {/* <Container maxWidth="xs" sx={{ pt: 2 }}>
            <ThemeToggle />
          </Container> */}
          <Container maxWidth="xs" sx={{ whiteSpace: "normal" }}>
            <Copyright sx={{ pt: 2 }} />
          </Container>
        </Container>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export const Dashboard = () => (
  <DashboardContent>
    <Outlet />
  </DashboardContent>
);
