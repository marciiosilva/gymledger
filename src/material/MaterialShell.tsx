import { Link as RouterLink, useLocation } from "react-router-dom";
import AccountBalanceWallet from "@mui/icons-material/AccountBalanceWallet";
import BarChart from "@mui/icons-material/BarChart";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Dashboard from "@mui/icons-material/Dashboard";
import Layers from "@mui/icons-material/Layers";
import MenuIcon from "@mui/icons-material/Menu";
import People from "@mui/icons-material/People";
import {
  Avatar,
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
  Typography
} from "@mui/material";
import { Children, Fragment, cloneElement, isValidElement, useMemo, useState } from "react";
import type { ReactElement, ReactNode } from "react";

const drawerWidth = 280;
type ActionElement = ReactElement<{
  children?: ReactNode;
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
  size?: "small" | "medium" | "large";
  sx?: object;
  variant?: "text" | "outlined" | "contained";
}>;

const navItems = [
  { label: "Dashboard", href: "/", icon: <Dashboard /> },
  { label: "Alunos", href: "/alunos", icon: <People />, badge: 148 },
  { label: "Financeiro", href: "/financeiro", icon: <AccountBalanceWallet />, badge: 23 },
  { label: "Planos", href: "#", icon: <Layers /> },
  { label: "Relatorios", href: "#", icon: <BarChart /> }
];

function flattenActionItems(node: ReactNode): ActionElement[] {
  return Children.toArray(node).flatMap((child) => {
    if (!isValidElement(child)) return [];
    if (child.type === Fragment) return flattenActionItems(child.props.children);
    return [child as ActionElement];
  });
}

interface MaterialShellProps {
  eyebrow: string;
  title: string;
  description: string;
  asideTitle: string;
  asideDescription: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function MaterialShell({
  eyebrow,
  title,
  description,
  asideTitle,
  asideDescription,
  actions,
  children
}: MaterialShellProps) {
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const actionItems = useMemo(() => flattenActionItems(actions), [actions]);
  const pageLabel = title.replace(/\.$/, "");

  const drawer = (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        color: "white",
        background:
          "linear-gradient(180deg, #0f1f17 0%, #123720 52%, #17472a 100%)",
        p: 2.25,
        display: "flex",
        flexDirection: "column",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.26) transparent",
        "&::-webkit-scrollbar": {
          width: 8
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent"
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(255,255,255,0.20)",
          borderRadius: 8,
          border: "2px solid transparent",
          backgroundClip: "content-box"
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "rgba(255,255,255,0.34)"
        }
      }}
    >
      <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
        <Avatar
          src="/branding/gymledger-logo.svg"
          alt="Logo GymLedger"
          sx={{ width: 44, height: 44, bgcolor: "rgba(255,255,255,0.12)" }}
        />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" fontWeight={900} noWrap>
            GymLedger
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.68)" }} noWrap>
            Studio Nova Era
          </Typography>
        </Box>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          mt: 2.5,
          p: 1.5,
          bgcolor: "rgba(255,255,255,0.10)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 2
        }}
      >
        <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.64)" }}>
          Agora
        </Typography>
        <Typography variant="h3" sx={{ mt: 0.5, color: "white" }}>
          23 pendencias
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.75, color: "rgba(255,255,255,0.72)" }}>
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
              borderRadius: 1.5,
              color: "rgba(255,255,255,0.78)",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.10)"
              }
            }}
          >
            <ListItemText
              primary="Acoes rapidas"
              slotProps={{
                primary: {
                  sx: {
                    fontWeight: 900,
                    fontSize: 12,
                    textTransform: "uppercase",
                    letterSpacing: 0.4
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
                <Box key={action.key ?? index} sx={{ "& .MuiButton-root": { width: "100%", justifyContent: "flex-start", borderRadius: 1.5 } }}>
                  {cloneElement(action, {
                    size: "small",
                    color: action.props.variant === "contained" ? "primary" : "inherit",
                    sx: {
                      color: action.props.variant === "contained" ? undefined : "white",
                      borderColor: action.props.variant === "contained" ? undefined : "rgba(255,255,255,0.24)",
                      bgcolor: action.props.variant === "contained" ? undefined : "rgba(255,255,255,0.06)",
                      "&:hover": {
                        borderColor: action.props.variant === "contained" ? undefined : "rgba(255,255,255,0.36)",
                        bgcolor: action.props.variant === "contained" ? undefined : "rgba(255,255,255,0.10)"
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

      <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.12)" }} />

      <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.64)" }}>
        Menu principal
      </Typography>
      <List sx={{ mt: 0.75 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.href;
          return (
            <ListItemButton
              key={item.label}
              component={RouterLink}
              to={item.href}
              selected={active}
              sx={{
                my: 0.5,
                borderRadius: 1.5,
                color: "rgba(255,255,255,0.78)",
                "&.Mui-selected": {
                  bgcolor: "rgba(129, 201, 149, 0.18)",
                  color: "white"
                },
                "&.Mui-selected:hover, &:hover": {
                  bgcolor: "rgba(255,255,255,0.12)"
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{ primary: { fontWeight: 800, fontSize: 14 } }}
              />
              {item.badge ? (
                <Chip
                  label={item.badge > 99 ? "99+" : item.badge}
                  size="small"
                  sx={{
                    height: 22,
                    bgcolor: active ? "rgba(255,255,255,0.18)" : "rgba(129,201,149,0.18)",
                    color: active ? "white" : "#81c995",
                    fontWeight: 800
                  }}
                />
              ) : null}
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ mt: "auto", pt: 2 }}>
        <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.12)" }} />
        <Chip
          label={asideTitle}
          size="small"
          sx={{
            bgcolor: "rgba(255,255,255,0.10)",
            color: "white",
            borderRadius: 1
          }}
        />
      </Box>
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
        <Stack spacing={{ xs: 3.25, sm: 3 }} sx={{ maxWidth: 1440, mx: "auto", px: { xs: 2.25, sm: 3, lg: 4 }, pt: { xs: 1.75, lg: 2.25 }, pb: { xs: 3, lg: 4 } }}>
          <Stack
            direction="row"
            spacing={1.5}
            sx={{ display: { xs: "flex", lg: "none" }, alignItems: "center" }}
          >
            <IconButton aria-label="Abrir menu lateral" onClick={() => setMobileNavOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="subtitle1" component="div" fontWeight={900} noWrap>
              {pageLabel}
            </Typography>
          </Stack>

          <Box
            component="section"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 1.5, md: 2 },
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(31,31,31,0.08)",
              pb: { xs: 2.5, lg: 3 }
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="overline"
                color="primary.dark"
                sx={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
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
            {description.trim() ? (
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520, lineHeight: 1.6 }}>
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
