// Based on MUI code from: https://mui.com/material-ui/react-drawer/#mini-variant-drawer

import * as React from "react";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

interface ComponentProps {
  appTitle: string;

  menuItems: ItemGroup[];
}

export interface ItemGroup {
  itemGroupNo: number;

  items: DrawerItem[];
}

export interface DrawerItem {
  text: string;

  icon?: any;

  navigateTo: string;
}

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,

  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,

    duration: theme.transitions.duration.enteringScreen,
  }),

  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,

    duration: theme.transitions.duration.leavingScreen,
  }),

  overflowX: "hidden",

  width: `calc(${theme.spacing(7)} + 1px)`,

  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",

  alignItems: "center",

  justifyContent: "flex-end",

  padding: theme.spacing(0, 1),

  // necessary for content to be below app bar

  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
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
  width: drawerWidth,

  flexShrink: 0,

  whiteSpace: "nowrap",

  boxSizing: "border-box",

  ...(open && {
    ...openedMixin(theme),

    "& .MuiDrawer-paper": openedMixin(theme),
  }),

  ...(!open && {
    ...closedMixin(theme),

    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer(props: ComponentProps) {
  const theme = useTheme();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const drawerOpen = localStorage.getItem("drawerOpen") === "true";

    setOpen(drawerOpen);
  }, []);

  const handleDrawerOpen = () => {
    localStorage.setItem("drawerOpen", "true");

    setOpen(true);
  };

  const handleDrawerClose = () => {
    localStorage.setItem("drawerOpen", "false");

    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,

              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div">
            {props.appTitle}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>

        <Divider />

        {props.menuItems.map((itemGroup, groupIndex) => (
          <div key={`div${itemGroup.itemGroupNo}`}>
            <List key={`list${itemGroup.itemGroupNo}`}>
              {itemGroup.items.map((item, itemIndex) => (
                <ListItem
                  key={`${item.text}-${itemGroup.itemGroupNo}`}
                  disablePadding
                  sx={{ display: "block" }}
                >
                  <ListItemButton
                    onClick={() => navigate(item.navigateTo)}
                    sx={{
                      minHeight: 48,

                      justifyContent: open ? "initial" : "center",

                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,

                        mr: open ? 3 : "auto",

                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    <ListItemText
                      primary={item.text}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            <Divider key={`divider${itemGroup.itemGroupNo}`} />
          </div>
        ))}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <DrawerHeader />

        {/* Navigating to pages gets rendered here in the Outlet component*/}
        <Outlet />
      </Box>
    </Box>
  );
}
