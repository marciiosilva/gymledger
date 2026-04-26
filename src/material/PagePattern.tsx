import ExpandMore from "@mui/icons-material/ExpandMore";
import Inbox from "@mui/icons-material/Inbox";
import Search from "@mui/icons-material/Search";
import WarningAmber from "@mui/icons-material/WarningAmber";
import {
  Box,
  Button,
  Collapse,
  CircularProgress,
  Stack,
  Typography
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import type { ReactNode } from "react";

interface PageSectionHeaderProps {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}

export function PageSectionHeader({ eyebrow, title, action }: PageSectionHeaderProps) {
  return (
    <Stack direction={{ xs: "column", lg: "row" }} gap={2} sx={{ justifyContent: "space-between" }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="overline" color="text.secondary" fontWeight={900}>
          {eyebrow}
        </Typography>
        <Typography variant="h2">{title}</Typography>
      </Box>
      {action ? <Box sx={{ alignSelf: { xs: "flex-start", lg: "center" } }}>{action}</Box> : null}
    </Stack>
  );
}

interface PageFilterPanelProps {
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  align?: "left" | "right";
}

export function PageFilterPanel({ open, onToggle, children, align = "right" }: PageFilterPanelProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const panelBg = alpha(theme.palette.text.primary, isDark ? 0.08 : 0.02);

  return (
    <>
      <Stack
        direction="row"
        sx={{
          mt: 1.5,
          alignItems: "center",
          justifyContent: align === "right" ? "flex-end" : "flex-start",
        }}
      >
        <Button
          variant="text"
          size="small"
          onClick={onToggle}
          endIcon={
            <ExpandMore
              sx={{
                transition: "transform 160ms ease",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          }
          sx={{ textTransform: "none", fontWeight: 700 }}
        >
          {open ? "Minimizar filtros" : "Expandir filtros"}
        </Button>
      </Stack>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box
          sx={{
            mt: 1.5,
            p: { xs: 1.25, md: 1.5 },
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 0.5,
            bgcolor: panelBg,
          }}
        >
          {children}
        </Box>
      </Collapse>
    </>
  );
}

type PageStateVariant = "loading" | "empty" | "error" | "no-results";

interface PageStateProps {
  variant: PageStateVariant;
  title?: string;
  description?: string;
  action?: ReactNode;
}

const pageStateDefaults: Record<PageStateVariant, { title: string; description: string }> = {
  loading: {
    title: "Carregando dados",
    description: "Aguarde enquanto buscamos as informacoes mais recentes.",
  },
  empty: {
    title: "Nenhum registro ainda",
    description: "Comece criando o primeiro item deste modulo.",
  },
  error: {
    title: "Nao foi possivel carregar",
    description: "Tente novamente em alguns instantes.",
  },
  "no-results": {
    title: "Nenhum resultado encontrado",
    description: "Ajuste os filtros ou limpe a busca para ver mais itens.",
  },
};

function PageStateIcon({ variant }: { variant: PageStateVariant }) {
  if (variant === "loading") {
    return <CircularProgress size={22} thickness={4} aria-label="Carregando" />;
  }

  if (variant === "error") {
    return <WarningAmber fontSize="small" />;
  }

  if (variant === "no-results") {
    return <Search fontSize="small" />;
  }

  return <Inbox fontSize="small" />;
}

export function PageState({ variant, title, description, action }: PageStateProps) {
  const defaults = pageStateDefaults[variant];
  const theme = useTheme();
  const isError = variant === "error";
  const iconColor = isError ? theme.palette.error.main : theme.palette.primary.main;
  const iconBg = alpha(iconColor, theme.palette.mode === "dark" ? 0.18 : 0.10);

  return (
    <Stack
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "loading" ? "polite" : undefined}
      spacing={1.25}
      sx={{
        minHeight: 220,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        border: "1px dashed",
        borderColor: isError ? "error.light" : "divider",
        borderRadius: 0.5,
        bgcolor: isError ? alpha(theme.palette.error.main, 0.04) : "transparent",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: 0.5,
          display: "grid",
          placeItems: "center",
          bgcolor: iconBg,
          color: iconColor,
        }}
      >
        <PageStateIcon variant={variant} />
      </Box>
      <Box sx={{ maxWidth: 440 }}>
        <Typography variant="h3">{title ?? defaults.title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          {description ?? defaults.description}
        </Typography>
      </Box>
      {action ? <Box sx={{ mt: 0.5 }}>{action}</Box> : null}
    </Stack>
  );
}
