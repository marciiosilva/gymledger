export const navItems = [
  "Dashboard",
  "Alunos",
  "Financeiro",
  "Planos",
  "Treinos",
  "Professores",
  "IA",
  "Relatorios"
];

export const topMetrics = [
  {
    title: "MRR",
    value: "R$ 48.200",
    delta: "+8.4% vs mes anterior",
    tone: "emerald"
  },
  {
    title: "Receita prevista em 30 dias",
    value: "R$ 84.000",
    delta: "91% da meta mensal",
    tone: "blue"
  },
  {
    title: "Inadimplencia",
    value: "12.8%",
    delta: "-2.1 pontos em 14 dias",
    tone: "amber"
  },
  {
    title: "Alunos ativos",
    value: "412",
    delta: "27 novos este mes",
    tone: "slate"
  }
];

export const alertCards = [
  {
    title: "Falhas de pagamento exigem acao hoje",
    description:
      "14 alunos entraram em tentativa final de cobranca. Ative lembrete automatico e bloqueio opcional.",
    action: "Revisar cobrancas"
  },
  {
    title: "Treinos gerados por IA aguardando revisao",
    description:
      "6 sugestoes ficaram prontas nas ultimas 2 horas para aprovacao dos professores.",
    action: "Abrir fila de treinos"
  }
];

export const cashflow = [
  { day: "Seg", amount: "R$ 9.200" },
  { day: "Ter", amount: "R$ 12.400" },
  { day: "Qua", amount: "R$ 10.980" },
  { day: "Qui", amount: "R$ 14.600" },
  { day: "Sex", amount: "R$ 11.840" }
];

export const quickActions = [
  "Cadastrar aluno",
  "Criar plano",
  "Lancar cobranca manual",
  "Gerar treino com IA"
];

export const moduleCards = [
  {
    title: "Financeiro",
    stat: "R$ 6.320 pendentes",
    description:
      "Receita recebida, prevista, falhas Stripe e historico por aluno em uma unica visao."
  },
  {
    title: "Alunos",
    stat: "38 exigem atencao",
    description:
      "Monitore status financeiro e operacional sem perder contexto do plano e do treino."
  },
  {
    title: "Treinos",
    stat: "72 treinos ativos",
    description:
      "Crie manualmente, gere com IA e acompanhe o que precisa de revisao da equipe."
  },
  {
    title: "Multi-unidade",
    stat: "2 unidades conectadas",
    description:
      "Tenha isolamento por academia e acompanhe resultados consolidados do grupo."
  }
];

export const studentsSnapshot = [
  {
    name: "Marina Costa",
    plan: "Performance 12x",
    financeStatus: "Adimplente",
    workoutStatus: "Treino renovado hoje"
  },
  {
    name: "Rafael Lima",
    plan: "Studio Mensal",
    financeStatus: "Atrasado",
    workoutStatus: "Check-in bloqueado"
  },
  {
    name: "Bianca Torres",
    plan: "Premium Coach",
    financeStatus: "Adimplente",
    workoutStatus: "Aguardando avaliacao"
  }
];

export const paymentRows = [
  {
    student: "Marina Costa",
    plan: "Performance 12x",
    status: "Pago",
    amount: "R$ 289",
    date: "Hoje, 09:14"
  },
  {
    student: "Rafael Lima",
    plan: "Studio Mensal",
    status: "Atrasado",
    amount: "R$ 219",
    date: "Ontem, 18:40"
  },
  {
    student: "Bianca Torres",
    plan: "Premium Coach",
    status: "Pago",
    amount: "R$ 349",
    date: "Hoje, 11:32"
  }
];

export const coachBoard = [
  {
    name: "Juliana Prado",
    focus: "Hipertrofia",
    pending: "2 revisoes de treino"
  },
  {
    name: "Caio Mendes",
    focus: "Funcional",
    pending: "4 alunos sem treino atualizado"
  },
  {
    name: "Lia Rocha",
    focus: "Cross training",
    pending: "1 anamnese pendente"
  }
];
