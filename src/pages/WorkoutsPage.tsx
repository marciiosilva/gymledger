import { ModulePlaceholderPage } from "./ModulePlaceholderPage";

export function WorkoutsPage() {
  return (
    <ModulePlaceholderPage
      eyebrow="Treinos"
      title="Treinos editaveis e prontos para associar."
      description="Monte estruturas por dias, exercicios, series, repeticoes e observacoes do professor."
      asideDescription="Treinos conectam professor, aluno e biblioteca de exercicios."
      primaryAction="Criar treino"
      items={[
        { title: "Full body iniciante", description: "Frequencia 3x por semana, dias A e B.", badge: "2 alunos" },
        { title: "Forca intermediario", description: "Divisao superior/inferior para progressao semanal.", badge: "1 aluno" },
        { title: "Mobilidade e core", description: "Base futura para alunos em retorno ou prevencao.", badge: "rascunho" },
      ]}
    />
  );
}
