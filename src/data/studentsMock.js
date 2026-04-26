export const studentMetrics = [
  {
    title: "Alunos ativos",
    value: "124",
    delta: "8 novas matrículas no mês",
    tone: "emerald",
    trend: "up"
  },
  {
    title: "Em risco financeiro",
    value: "11",
    delta: "7 atrasados e 4 pendentes",
    tone: "amber",
    trend: "down"
  },
  {
    title: "Ticket médio",
    value: "R$ 217",
    delta: "Base recorrente mensal",
    tone: "blue",
    trend: "up"
  },
  {
    title: "Churn previsto",
    value: "3,2%",
    delta: "queda de 0,8 p.p.",
    tone: "slate",
    trend: "up"
  }
];

export const studentSegments = [
  { label: "Todos", count: 148, active: true },
  { label: "Ativos", count: 124 },
  { label: "Pendentes", count: 17 },
  { label: "Atrasados", count: 7 },
  { label: "Inativos", count: 24 }
];

export const studentRows = [
  {
    name: "Marina Costa",
    initials: "MC",
    plan: "Studio Mensal",
    status: "active",
    financialStatus: "paid",
    dueDate: "28 Abr",
    amount: "R$ 219",
    lastCheckIn: "Hoje, 07:42",
    channel: "WhatsApp"
  },
  {
    name: "Rafael Lima",
    initials: "RL",
    plan: "Studio Mensal",
    status: "active",
    financialStatus: "late",
    dueDate: "05 Abr",
    amount: "R$ 219",
    lastCheckIn: "Ontem, 19:10",
    channel: "WhatsApp"
  },
  {
    name: "Bianca Torres",
    initials: "BT",
    plan: "Funcional 5x",
    status: "active",
    financialStatus: "paid",
    dueDate: "30 Abr",
    amount: "R$ 279",
    lastCheckIn: "Hoje, 10:21",
    channel: "E-mail"
  },
  {
    name: "Paula Mota",
    initials: "PM",
    plan: "Funcional 3x",
    status: "active",
    financialStatus: "late",
    dueDate: "08 Abr",
    amount: "R$ 189",
    lastCheckIn: "18 Abr, 18:44",
    channel: "WhatsApp"
  },
  {
    name: "Julia Menezes",
    initials: "JM",
    plan: "Mensal Studio",
    status: "active",
    financialStatus: "pending",
    dueDate: "26 Abr",
    amount: "R$ 219",
    lastCheckIn: "Hoje, 06:55",
    channel: "SMS"
  },
  {
    name: "Diego Nunes",
    initials: "DN",
    plan: "Cross Premium",
    status: "active",
    financialStatus: "late",
    dueDate: "10 Abr",
    amount: "R$ 249",
    lastCheckIn: "12 Abr, 20:12",
    channel: "WhatsApp"
  }
];

export const attentionQueue = [
  {
    title: "Atraso com presença recente",
    description: "3 alunos treinaram nos últimos 2 dias, mas ainda não quitaram a mensalidade.",
    badge: "prioridade alta"
  },
  {
    title: "Vencimento amanhã",
    description: "5 alunos entram no lembrete D-1 e podem receber mensagem preventiva.",
    badge: "ação hoje"
  },
  {
    title: "Sem check-in há 14 dias",
    description: "4 alunos ativos reduziram frequência e merecem acompanhamento antes do churn.",
    badge: "retenção"
  }
];

export const planMix = [
  { plan: "Studio Mensal", count: 48, revenue: "R$ 10.512" },
  { plan: "Funcional 5x", count: 32, revenue: "R$ 8.928" },
  { plan: "Cross Premium", count: 26, revenue: "R$ 6.474" },
  { plan: "Pilates Duo", count: 18, revenue: "R$ 3.582" }
];
