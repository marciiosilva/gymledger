export const navItems = [
  { label: "Dashboard", href: "/", active: true },
  { label: "Alunos", href: "/alunos", badge: 148 },
  { label: "Financeiro", badge: 23 },
  { label: "Planos" },
  { label: "Relatorios" }
];

export const topMetrics = [
  {
    title: "MRR previsto",
    value: "R$ 18.720",
    delta: "124 alunos ativos no ciclo atual",
    tone: "emerald",
    trend: "up"
  },
  {
    title: "Recebido no mes",
    value: "R$ 15.410",
    delta: "82% do previsto ja conciliado",
    tone: "blue",
    trend: "up"
  },
  {
    title: "A receber",
    value: "R$ 3.310",
    delta: "19 mensalidades abertas",
    tone: "slate",
    trend: "up"
  },
  {
    title: "Inadimplencia",
    value: "R$ 1.240",
    delta: "7 alunos vencidos ha mais de 5 dias",
    tone: "amber",
    trend: "down"
  },
  {
    title: "Saldo de caixa",
    value: "R$ 9.860",
    delta: "Entradas - saidas do mes",
    tone: "blue",
    trend: "up"
  }
];

export const quickActions = [
  "Importar extrato",
  "Cadastrar aluno",
  "Criar plano",
  "Abrir regua de cobranca"
];

export const weeklyCashflow = [
  { day: "Seg", amount: "R$ 2.120" },
  { day: "Ter", amount: "R$ 3.480" },
  { day: "Qua", amount: "R$ 1.960" },
  { day: "Qui", amount: "R$ 4.210" },
  { day: "Sex", amount: "R$ 3.640" }
];

export const cadenceItems = [
  {
    window: "D-3",
    title: "Lembrete suave antes do vencimento",
    count: 8,
    action: "Copiar mensagem"
  },
  {
    window: "D+0",
    title: "Cobrar quem vence hoje",
    count: 5,
    action: "Abrir WhatsApp"
  },
  {
    window: "D+3",
    title: "Atrasos que exigem acompanhamento",
    count: 4,
    action: "Marcar cobrado"
  },
  {
    window: "D+7",
    title: "Risco real de churn por atraso",
    count: 3,
    action: "Ver casos"
  }
];

export const moduleCards = [
  {
    title: "Importacao e conciliacao",
    stat: "70% auto-match",
    description:
      "Upload de CSV ou OFX para bater extrato com mensalidades por valor, nome e data."
  },
  {
    title: "Mensalidades",
    stat: "19 em aberto",
    description:
      "Serie automatica por plano, baixa manual simples e status financeiro por aluno."
  },
  {
    title: "Fluxo de caixa",
    stat: "R$ 9.860 de saldo",
    description:
      "Entradas e saidas reais por categoria, sem depender de gateway para gerar previsibilidade."
  },
  {
    title: "Regua de cobranca",
    stat: "20 acoes hoje",
    description:
      "Lista pronta para cobrar por WhatsApp com templates editaveis e historico de contato."
  }
];

export const overdueRows = [
  {
    student: "Rafael Lima",
    plan: "Studio Mensal",
    dueDate: "05 Abr",
    amount: "R$ 219",
    status: "late"
  },
  {
    student: "Paula Mota",
    plan: "Funcional 3x",
    dueDate: "08 Abr",
    amount: "R$ 189",
    status: "late"
  },
  {
    student: "Diego Nunes",
    plan: "Cross Premium",
    dueDate: "10 Abr",
    amount: "R$ 249",
    status: "late"
  },
  {
    student: "Camila Freire",
    plan: "Pilates Duo",
    dueDate: "12 Abr",
    amount: "R$ 199",
    status: "pending"
  }
];

export const recentPayments = [
  {
    student: "Marina Costa",
    plan: "Studio Mensal",
    status: "Pago",
    amount: "R$ 219",
    date: "Hoje, 09:14"
  },
  {
    student: "Bianca Torres",
    plan: "Funcional 5x",
    status: "Pago",
    amount: "R$ 279",
    date: "Hoje, 10:51"
  },
  {
    student: "Joao Pedro",
    plan: "Cross Premium",
    status: "Pendente",
    amount: "R$ 249",
    date: "Hoje, 11:32"
  }
];

export const paymentRows = recentPayments;

export const reconciliationQueue = [
  {
    title: "Extrato Nubank importado",
    description: "14 lancamentos encontrados, 10 conciliados automaticamente.",
    badge: "4 pendentes"
  },
  {
    title: "PIX sem nome do aluno",
    description: "3 entradas aguardam vinculacao manual a mensalidades em aberto.",
    badge: "acao manual"
  }
];

export const dueSoon = [
  {
    student: "Julia Menezes",
    plan: "Mensal Studio",
    dueIn: "vence amanha"
  },
  {
    student: "Andre Castro",
    plan: "Cross 12x",
    dueIn: "vence em 3 dias"
  },
  {
    student: "Renata Luz",
    plan: "Funcional 3x",
    dueIn: "vence em 5 dias"
  }
];
