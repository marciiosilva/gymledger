import { useParams } from "react-router-dom";
import { ModulePlaceholderPage } from "./ModulePlaceholderPage";

export function WorkoutDetailPage() {
  const { id = "treino" } = useParams();

  return (
    <ModulePlaceholderPage
      eyebrow="Detalhe do treino"
      title={`Treino ${id}`}
      description="Estrutura preparada para revisar dias, exercicios e alunos vinculados."
      asideDescription="Detalhe do treino com edicao e associacao ao aluno."
      primaryAction="Editar treino"
      backTo="/treinos"
      items={[
        { title: "Dia A", description: "Agachamento livre, supino reto e prancha.", badge: "3 exercicios" },
        { title: "Dia B", description: "Remada baixa e complementares.", badge: "2 exercicios" },
      ]}
    />
  );
}
