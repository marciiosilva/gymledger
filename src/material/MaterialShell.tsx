import { Link as RouterLink, useLocation } from "react-router-dom";
import DarkMode from "@mui/icons-material/DarkMode";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LightMode from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Chip,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Children, Fragment, cloneElement, isValidElement, useMemo, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { mainNavItems } from "../app/routes";
import { dashboardSectionGap } from "./layout";
import { useColorMode } from "./ColorModeProvider";

const drawerWidth = 280;
type ActionElement = ReactElement<{
  children?: ReactNode;
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
  size?: "small" | "medium" | "large";
  sx?: object;
  variant?: "text" | "outlined" | "contained";
}>;

export function isMainNavItemActive(pathname: string, itemPath: string) {
  if (itemPath === "/") {
    return pathname === "/";
  }

  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}

function flattenActionItems(node: ReactNode): ActionElement[] {
  return Children.toArray(node).flatMap((child) => {
    if (!isValidElement(child)) return [];
    if (child.type === Fragment) {
      const props = child.props as { children?: ReactNode };
      return flattenActionItems(props.children);
    }
    return [child as ActionElement];
  });
}

interface MaterialShellProps {
  eyebrow: string;
  title: string;
  description: string;
  asideDescription: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function MaterialShell({
  eyebrow,
  title,
  description,
  asideDescription,
  actions,
  children
}: MaterialShellProps) {
  const theme = useTheme();
  const { mode, toggleMode } = useColorMode();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const actionItems = useMemo(() => flattenActionItems(actions), [actions]);
  const pageLabel = (title.trim() || eyebrow.trim() || "GymLedger").replace(/\.$/, "");
  const isDark = mode === "dark";
  const sidebarBorder = alpha(theme.palette.text.primary, isDark ? 0.12 : 0.08);
  const sidebarMutedText = alpha(theme.palette.text.primary, isDark ? 0.68 : 0.62);
  const sidebarHover = alpha(theme.palette.primary.main, isDark ? 0.16 : 0.08);
  const sidebarSelected = alpha(theme.palette.primary.main, isDark ? 0.22 : 0.12);
  const sidebarPanelBg = isDark
    ? alpha(theme.palette.background.paper, 0.82)
    : alpha(theme.palette.background.paper, 0.96);

  const drawer = (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        color: "text.primary",
        bgcolor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
        p: 2.25,
        display: "flex",
        flexDirection: "column",
        scrollbarWidth: "thin",
        scrollbarColor: `${alpha(theme.palette.text.primary, 0.28)} transparent`,
        "&::-webkit-scrollbar": {
          width: 8
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent"
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: alpha(theme.palette.text.primary, 0.18),
          borderRadius: 8,
          border: "2px solid transparent",
          backgroundClip: "content-box"
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: alpha(theme.palette.text.primary, 0.32)
        }
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 2,
          height: 88,
          flexShrink: 0,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 0.5,
          bgcolor: "#f5faf6",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 1
        }}
      >
        <Box
          component="img"
          src="/branding/logo-menu-cropped.png"
          alt="GymLedger"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center"
          }}
        />
      </Box>

      <Paper
        elevation={0}
        sx={{
          mt: 2.5,
          p: 1.25,
          bgcolor: sidebarPanelBg,
          color: "text.primary",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 0.5,
          boxShadow: "none"
        }}
      >
        <Typography variant="overline" sx={{ color: "text.secondary" }}>
          Agora
        </Typography>
        <Typography variant="h3" noWrap sx={{ mt: 0.5, color: "text.primary" }}>
          23 pendências
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mt: 0.75,
            color: "text.secondary",
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2
          }}
        >
          {asideDescription}
        </Typography>
      </Paper>

      {actionItems.length ? (
        <Box sx={{ mt: 2.5 }}>
          <ListItemButton
            aria-expanded={quickActionsOpen}
            aria-controls="quick-actions-panel"
            onClick={() => setQuickActionsOpen((open) => !open)}
            sx={{
              minHeight: 40,
              px: 1,
              borderRadius: 0.5,
              color: "text.secondary",
              "&:hover": {
                bgcolor: "action.hover"
              }
            }}
          >
            <ListItemText
              primary="Ações rápidas"
              slotProps={{
                primary: {
                  sx: {
                    fontWeight: 900,
                    fontSize: 12,
                    textTransform: "uppercase",
                    minWidth: 0
                  }
                }
              }}
            />
            <ExpandMore
              sx={{
                fontSize: 20,
                transition: "transform 160ms ease",
                transform: quickActionsOpen ? "rotate(180deg)" : "rotate(0deg)"
              }}
            />
          </ListItemButton>
          <Collapse in={quickActionsOpen} timeout="auto" unmountOnExit>
            <Stack id="quick-actions-panel" spacing={1} sx={{ mt: 1 }}>
              {actionItems.map((action, index) => (
                <Box key={action.key ?? index} sx={{ "& .MuiButton-root": { width: "100%", justifyContent: "flex-start", borderRadius: 0.5 } }}>
                  {cloneElement(action, {
                    size: "small",
                    color: action.props.variant === "contained" ? "primary" : "primary",
                    sx: {
                      borderRadius: 0.5,
                      borderColor: action.props.variant === "contained" ? undefined : sidebarBorder,
                      bgcolor: action.props.variant === "contained" ? undefined : alpha(theme.palette.primary.main, 0.04),
                      "&:hover": {
                        borderColor: action.props.variant === "contained" ? undefined : alpha(theme.palette.primary.main, 0.32),
                        bgcolor: action.props.variant === "contained" ? undefined : sidebarHover
                      },
                      ...action.props.sx
                    }
                  })}
                </Box>
              ))}
            </Stack>
          </Collapse>
        </Box>
      ) : null}

      <Divider sx={{ mt: 2, mb: 1 }} />

      <Box
        sx={{
          position: "sticky",
          top: 88,
          zIndex: 1,
          bgcolor: "background.paper",
          py: 1,
          mb: 1
        }}
      >
        <Typography component="div" variant="overline" sx={{ color: "text.secondary", px: 1 }}>
          Menu principal
        </Typography>
      </Box>
      <List sx={{ mt: 0.5 }}>
        {mainNavItems.map((item) => {
          const active = isMainNavItemActive(location.pathname, item.path);
          return (
            <ListItemButton
              key={item.label}
              component={RouterLink}
              to={item.path}
              onClick={() => setMobileNavOpen(false)}
              selected={active}
              sx={{
                my: 0.5,
                minHeight: 42,
                px: 1,
                borderRadius: 0.5,
                color: sidebarMutedText,
                "&.Mui-selected": {
                  bgcolor: sidebarSelected,
                  color: "text.primary"
                },
                "&.Mui-selected:hover, &:hover": {
                  bgcolor: sidebarHover
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ minWidth: 0 }}
                slotProps={{
                  primary: {
                    sx: {
                      fontWeight: 800,
                      fontSize: 14,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }
                  }
                }}
              />
              {item.badge ? (
                <Chip
                  label={item.badge > 99 ? "99+" : item.badge}
                  size="small"
                  sx={{
                    height: 22,
                    maxWidth: 44,
                    bgcolor: active ? alpha(theme.palette.primary.main, 0.20) : alpha(theme.palette.primary.main, 0.10),
                    color: "primary.main",
                    fontWeight: 800,
                    borderRadius: 0.5
                  }}
                />
              ) : null}
            </ListItemButton>
          );
        })}
      </List>

    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", lg: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            border: 0,
            boxSizing: "border-box",
            overflow: "hidden"
          }
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="temporary"
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        sx={{
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            border: 0,
            boxSizing: "border-box",
            overflow: "hidden"
          }
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          ml: { lg: `${drawerWidth}px` },
          minHeight: "100vh"
        }}
      >
        <Stack
          spacing={dashboardSectionGap}
          sx={{
            width: "100%",
            maxWidth: { xs: 1560, xl: "none" },
            mx: "auto",
            px: { xs: 2, sm: 2, lg: 2.5, xl: 3 },
            pt: { xs: 1.75, lg: 1.25 },
            pb: { xs: 2.25, lg: 2 }
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ display: { xs: "flex", lg: "none" }, alignItems: "center" }}
          >
            <IconButton aria-label="Abrir menu lateral" onClick={() => setMobileNavOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="subtitle1" component="div" noWrap sx={{ minWidth: 0, flex: 1, fontWeight: 900 }}>
              {pageLabel}
            </Typography>
            <Box sx={{ ml: "auto" }}>
              <Tooltip title={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}>
                <IconButton
                  aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
                  onClick={toggleMode}
                  size="small"
                >
                  {isDark ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>
          </Stack>

          <Box
            component="section"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.25,
              borderBottom: "1px solid",
              borderColor: "divider",
              pb: { xs: 1.75, lg: 2.25 }
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="overline"
                  color="primary.dark"
                  sx={{
                    fontWeight: 800,
                    fontSize: "0.7rem",
                    lineHeight: 1.2
                  }}
                >
                  {eyebrow}
                </Typography>
                {title.trim() ? (
                  <Typography
                    variant="h1"
                    sx={{
                      mt: 0.5,
                      maxWidth: 720,
                      fontSize: { xs: "1.8rem", md: "2.35rem", xl: "2.75rem" },
                      lineHeight: 1.08
                    }}
                  >
                    {title}
                  </Typography>
                ) : null}
              </Box>
              <Tooltip title={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}>
                <IconButton
                  aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
                  onClick={toggleMode}
                  sx={{ display: { xs: "none", lg: "inline-flex" } }}
                >
                  {isDark ? <LightMode /> : <DarkMode />}
                </IconButton>
              </Tooltip>
            </Stack>
            {description.trim() ? (
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720, lineHeight: 1.6 }}>
                {description}
              </Typography>
            ) : null}
          </Box>

          {children}
        </Stack>
      </Box>
    </Box>
  );
}
