export const financeMetrics = [
  {
    title: "Receita conciliada",
    value: "R$ 15.410",
    delta: "82% do previsto no mês",
    tone: "emerald",
    trend: "up"
  },
  {
    title: "A receber",
    value: "R$ 3.310",
    delta: "19 mensalidades abertas",
    tone: "blue",
    trend: "up"
  },
  {
    title: "Despesas do mês",
    value: "R$ 5.550",
    delta: "aluguel, folha e operação",
    tone: "slate",
    trend: "down"
  },
  {
    title: "Inadimplência",
    value: "R$ 1.240",
    delta: "7 alunos acima de D+5",
    tone: "amber",
    trend: "down"
  }
];

export const cashflowSummary = [
  { label: "Entradas", amount: "R$ 18.720", detail: "MRR previsto" },
  { label: "Recebido", amount: "R$ 15.410", detail: "conciliado" },
  { label: "Saídas", amount: "R$ 5.550", detail: "registradas" },
  { label: "Saldo", amount: "R$ 9.860", detail: "caixa atual" }
];

export const transactionRows = [
  {
    date: "25 Abr",
    description: "PIX Marina Costa",
    category: "Mensalidade",
    account: "Nubank PJ",
    amount: "R$ 219",
    type: "Entrada",
    status: "paid"
  },
  {
    date: "25 Abr",
    description: "Cartão Bianca Torres",
    category: "Mensalidade",
    account: "Stone",
    amount: "R$ 279",
    type: "Entrada",
    status: "paid"
  },
  {
    date: "24 Abr",
    description: "Aluguel unidade",
    category: "Estrutura",
    account: "Itaú",
    amount: "R$ 3.200",
    type: "Saída",
    status: "paid"
  },
  {
    date: "24 Abr",
    description: "PIX sem identificação",
    category: "A conciliar",
    account: "Nubank PJ",
    amount: "R$ 189",
    type: "Entrada",
    status: "pending"
  },
  {
    date: "23 Abr",
    description: "Fornecedor limpeza",
    category: "Operação",
    account: "Itaú",
    amount: "R$ 460",
    type: "Saída",
    status: "paid"
  },
  {
    date: "22 Abr",
    description: "Mensalidade Rafael Lima",
    category: "Mensalidade",
    account: "Manual",
    amount: "R$ 219",
    type: "Entrada",
    status: "late"
  }
];

export const reconciliationItems = [
  {
    title: "Extrato Nubank PJ",
    description: "14 lançamentos importados, 10 conciliados automaticamente.",
    badge: "4 pendentes",
    tone: "warning"
  },
  {
    title: "Stone cartão",
    description: "6 recebimentos de cartão conciliados com mensalidades do dia.",
    badge: "100% ok",
    tone: "success"
  },
  {
    title: "Pagamentos manuais",
    description: "3 baixas dependem de confirmação antes do fechamento.",
    badge: "revisar",
    tone: "info"
  }
];

export const expenseBreakdown = [
  { label: "Aluguel", amount: "R$ 3.200", share: "58%" },
  { label: "Folha", amount: "R$ 1.420", share: "26%" },
  { label: "Operação", amount: "R$ 650", share: "12%" },
  { label: "Software", amount: "R$ 280", share: "4%" }
];

export const receivableQueue = [
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
    student: "Julia Menezes",
    plan: "Mensal Studio",
    dueDate: "26 Abr",
    amount: "R$ 219",
    status: "pending"
  }
];
