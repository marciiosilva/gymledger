import { Link as RouterLink, useLocation } from "react-router-dom";
import AccountBalanceWallet from "@mui/icons-material/AccountBalanceWallet";
import BarChart from "@mui/icons-material/BarChart";
import Dashboard from "@mui/icons-material/Dashboard";
import Layers from "@mui/icons-material/Layers";
import People from "@mui/icons-material/People";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import type { ReactNode } from "react";

const drawerWidth = 280;

const navItems = [
  { label: "Dashboard", href: "/", icon: <Dashboard /> },
  { label: "Alunos", href: "/alunos", icon: <People />, badge: 148 },
  { label: "Financeiro", href: "/financeiro", icon: <AccountBalanceWallet />, badge: 23 },
  { label: "Planos", href: "#", icon: <Layers /> },
  { label: "Relatorios", href: "#", icon: <BarChart /> }
];

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

  const drawer = (
    <Box
      sx={{
        minHeight: "100%",
        color: "white",
        background:
          "linear-gradient(180deg, #0f1f17 0%, #123720 52%, #17472a 100%)",
        p: 2.5
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Avatar
          src="/branding/gymledger-logo.svg"
          alt="Logo GymLedger"
          sx={{ width: 56, height: 56, bgcolor: "rgba(255,255,255,0.12)" }}
        />
        <Box>
          <Typography variant="h6" fontWeight={800}>
            GymLedger
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.68)" }}>
            Controle financeiro. Performance real.
          </Typography>
        </Box>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 2,
          bgcolor: "rgba(255,255,255,0.10)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.14)"
        }}
      >
        <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.64)" }}>
          Conta principal
        </Typography>
        <Typography variant="subtitle1" fontWeight={800}>
          Studio Nova Era
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: "rgba(255,255,255,0.72)" }}>
          {asideDescription}
        </Typography>
      </Paper>

      <List sx={{ mt: 2 }}>
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
                borderRadius: 3,
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

      <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.12)" }} />
      <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.64)" }}>
        {asideTitle}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, color: "rgba(255,255,255,0.76)" }}>
        Design system Material aplicado em todos os modulos principais.
      </Typography>
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
            boxSizing: "border-box"
          }
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          ml: { lg: `${drawerWidth}px` },
          px: { xs: 2, sm: 3, lg: 4 },
          py: { xs: 3, lg: 4 }
        }}
      >
        <Stack spacing={4} sx={{ maxWidth: 1440, mx: "auto" }}>
          <Stack
            direction={{ xs: "column", xl: "row" }}
            spacing={3}
            sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", xl: "flex-start" } }}
          >
            <Box sx={{ maxWidth: 800 }}>
              <Typography variant="overline" color="primary.dark" fontWeight={900}>
                {eyebrow}
              </Typography>
              <Typography variant="h1" sx={{ mt: 1, maxWidth: 760 }}>
                {title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2, maxWidth: 720, lineHeight: 1.75 }}>
                {description}
              </Typography>
            </Box>
            {actions ? (
              <Stack direction="row" gap={1.25} sx={{ flexWrap: "wrap", justifyContent: { xl: "flex-end" } }}>
                {actions}
              </Stack>
            ) : null}
          </Stack>

          {children}
        </Stack>
      </Box>
    </Box>
  );
}
