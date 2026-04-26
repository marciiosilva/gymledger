import ArrowBack from "@mui/icons-material/ArrowBack";
import Add from "@mui/icons-material/Add";
import FilterList from "@mui/icons-material/FilterList";
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  Typography
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { DashboardCard } from "../material/DashboardCard";
import { dashboardMainSplitSx, dashboardSectionGap } from "../material/layout";
import { MaterialShell } from "../material/MaterialShell";
import { PageSectionHeader } from "../material/PagePattern";

interface ModulePlaceholderPageProps {
  eyebrow: string;
  title: string;
  description: string;
  asideDescription: string;
  primaryAction?: string;
  backTo?: string;
  items: Array<{
    title: string;
    description: string;
    badge: string;
  }>;
}

export function ModulePlaceholderPage({
  eyebrow,
  title,
  description,
  asideDescription,
  primaryAction = "Novo registro",
  backTo,
  items,
}: ModulePlaceholderPageProps) {
  return (
    <MaterialShell
      eyebrow={eyebrow}
      title={title}
      description={description}
      asideDescription={asideDescription}
      actions={
        <>
          {backTo ? (
            <Button component={RouterLink} to={backTo} variant="outlined" startIcon={<ArrowBack />}>
              Voltar
            </Button>
          ) : null}
          <Button variant="outlined" startIcon={<FilterList />}>
            Filtrar
          </Button>
          <Button variant="contained" startIcon={<Add />}>
            {primaryAction}
          </Button>
        </>
      }
    >
      <Box sx={dashboardMainSplitSx}>
        <DashboardCard>
          <PageSectionHeader eyebrow="Lista inicial" title="Base navegavel para o MVP" />
          <Stack spacing={1.25} divider={<Divider flexItem />} sx={{ mt: 2 }}>
            {items.map((item) => (
              <Stack
                key={item.title}
                direction={{ xs: "column", sm: "row" }}
                gap={1.5}
                sx={{ py: 0.75, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" } }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography fontWeight={900}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                    {item.description}
                  </Typography>
                </Box>
                <Chip label={item.badge} color="primary" variant="outlined" size="small" />
              </Stack>
            ))}
          </Stack>
        </DashboardCard>

        <Stack spacing={dashboardSectionGap} sx={{ minWidth: 0 }}>
          <DashboardCard surface="emphasis">
            <Typography variant="overline" color="text.secondary" fontWeight={900}>
              Proxima entrega
            </Typography>
            <Typography variant="h3" sx={{ mt: 0.5 }}>
              Esta rota ja esta pronta para receber CRUD, filtros e estados padronizados.
            </Typography>
          </DashboardCard>
        </Stack>
      </Box>
    </MaterialShell>
  );
}
