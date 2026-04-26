import { ModulePlaceholderPage } from "./ModulePlaceholderPage";

export function ImportPage() {
  return (
    <ModulePlaceholderPage
      eyebrow="Importacoes"
      title="Importacoes com preview e validacao."
      description="Prepare onboarding por CSV/XLSX com erros por linha antes de gravar dados."
      asideDescription="Importacao acelera onboarding sem perder controle de qualidade."
      primaryAction="Enviar arquivo"
      items={[
        { title: "alunos-abril.csv", description: "8 linhas analisadas, 6 validas e 2 com erro.", badge: "validado" },
        { title: "modelo-alunos.xlsx", description: "Planilha modelo para cadastro de alunos.", badge: "modelo" },
      ]}
    />
  );
}
