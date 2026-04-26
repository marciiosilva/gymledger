import { useParams } from "react-router-dom";
import { ModulePlaceholderPage } from "./ModulePlaceholderPage";

export function StudentDetailPage() {
  const { id = "aluno" } = useParams();

  return (
    <ModulePlaceholderPage
      eyebrow="Detalhe do aluno"
      title={`Aluno ${id}`}
      description="Detalhe preparado para cadastro, financeiro, treinos e check-ins."
      asideDescription="Detalhe do aluno conecta cadastro, pagamentos e treino ativo."
      primaryAction="Editar aluno"
      backTo="/alunos"
      items={[
        { title: "Cadastro", description: "Dados pessoais, plano ativo e status operacional.", badge: "base" },
        { title: "Financeiro", description: "Mensalidades, pagamentos e status financeiro.", badge: "historico" },
        { title: "Treinos", description: "Treino ativo e historico de associacoes.", badge: "ativo" },
        { title: "Check-ins", description: "Frequencia recente e presencas registradas.", badge: "3 eventos" },
      ]}
    />
  );
}
