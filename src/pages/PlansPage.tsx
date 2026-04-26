import { ModulePlaceholderPage } from "./ModulePlaceholderPage";

export function PlansPage() {
  return (
    <ModulePlaceholderPage
      eyebrow="Planos"
      title="Planos ativos para mensalidades previsiveis."
      description="Organize valores, periodicidades e alunos vinculados antes de abrir o cadastro operacional."
      asideDescription="Planos sustentam alunos, mensalidades e previsao de receita."
      primaryAction="Criar plano"
      items={[
        { title: "Studio Mensal", description: "R$ 219,00 por mes, vencimento no dia 5.", badge: "48 alunos" },
        { title: "Funcional 3x", description: "R$ 189,00 por mes, rotina de tres aulas semanais.", badge: "32 alunos" },
        { title: "Cross Premium", description: "R$ 249,00 por mes, acesso premium.", badge: "26 alunos" },
      ]}
    />
  );
}
