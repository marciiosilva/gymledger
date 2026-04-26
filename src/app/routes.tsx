import FitnessCenter from "@mui/icons-material/FitnessCenter";
import AccountBalanceWallet from "@mui/icons-material/AccountBalanceWallet";
import CloudUpload from "@mui/icons-material/CloudUpload";
import Dashboard from "@mui/icons-material/Dashboard";
import Layers from "@mui/icons-material/Layers";
import People from "@mui/icons-material/People";
import SportsGymnastics from "@mui/icons-material/SportsGymnastics";
import type { ReactNode } from "react";
import App from "../App";
import { ExercisePage } from "../pages/ExercisePage";
import { FinancePage } from "../pages/FinancePage";
import { ImportPage } from "../pages/ImportPage";
import { PlansPage } from "../pages/PlansPage";
import { StudentDetailPage } from "../pages/StudentDetailPage";
import { StudentsPage } from "../pages/StudentsPage";
import { WorkoutDetailPage } from "../pages/WorkoutDetailPage";
import { WorkoutsPage } from "../pages/WorkoutsPage";

export interface AppRoute {
  path: string;
  element: ReactNode;
  label: string;
  icon: ReactNode;
  showInNav?: boolean;
  badge?: number;
}

export const appRoutes: AppRoute[] = [
  {
    path: "/",
    element: <App />,
    label: "Inicio",
    icon: <Dashboard />,
    showInNav: true,
  },
  {
    path: "/alunos",
    element: <StudentsPage />,
    label: "Alunos",
    icon: <People />,
    showInNav: true,
    badge: 148,
  },
  {
    path: "/alunos/:id",
    element: <StudentDetailPage />,
    label: "Detalhe do aluno",
    icon: <People />,
  },
  {
    path: "/financeiro",
    element: <FinancePage />,
    label: "Financeiro",
    icon: <AccountBalanceWallet />,
    showInNav: true,
    badge: 23,
  },
  {
    path: "/planos",
    element: <PlansPage />,
    label: "Planos",
    icon: <Layers />,
    showInNav: true,
  },
  {
    path: "/treinos",
    element: <WorkoutsPage />,
    label: "Treinos",
    icon: <FitnessCenter />,
    showInNav: true,
  },
  {
    path: "/treinos/:id",
    element: <WorkoutDetailPage />,
    label: "Detalhe do treino",
    icon: <FitnessCenter />,
  },
  {
    path: "/exercicios",
    element: <ExercisePage />,
    label: "Exercicios",
    icon: <SportsGymnastics />,
    showInNav: true,
  },
  {
    path: "/importacoes",
    element: <ImportPage />,
    label: "Importacoes",
    icon: <CloudUpload />,
    showInNav: true,
  },
];

export const mainNavItems = appRoutes.filter((route) => route.showInNav);
