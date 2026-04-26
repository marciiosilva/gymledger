import { ModulePlaceholderPage } from "./ModulePlaceholderPage";

export function ExercisePage() {
  return (
    <ModulePlaceholderPage
      eyebrow="Exercicios"
      title="Biblioteca de exercicios reutilizavel."
      description="Cadastre movimentos, grupos musculares, imagens, videos e notas tecnicas."
      asideDescription="Exercicios abastecem a montagem dos treinos."
      primaryAction="Criar exercicio"
      items={[
        { title: "Agachamento livre", description: "Pernas, foco em amplitude e controle.", badge: "ativo" },
        { title: "Supino reto", description: "Peito, ombros e triceps.", badge: "ativo" },
        { title: "Remada baixa", description: "Costas, puxada horizontal.", badge: "ativo" },
      ]}
    />
  );
}
