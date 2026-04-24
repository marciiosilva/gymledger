import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getMetrics(gymId: string) {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [
      activePlans,
      receivedThisMonth,
      pendingThisMonth,
      lateTotal,
      recentMensalidades,
    ] = await Promise.all([
      // MRR previsto: soma dos planos ativos
      this.prisma.plan.findMany({
        where: { gymId, active: true },
        include: {
          _count: { select: { students: { where: { status: 'ACTIVE' } } } },
        },
      }),

      // Recebido no mês
      this.prisma.mensalidade.aggregate({
        where: { gymId, status: 'PAID', paidAt: { gte: startOfMonth, lte: endOfMonth } },
        _sum: { value: true },
      }),

      // A receber no mês (pendentes com vencimento no mês)
      this.prisma.mensalidade.aggregate({
        where: {
          gymId,
          status: { in: ['PENDING', 'LATE'] },
          dueDate: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { value: true },
      }),

      // Inadimplência: mensalidades vencidas há > 5 dias
      this.prisma.mensalidade.aggregate({
        where: {
          gymId,
          status: { in: ['PENDING', 'LATE'] },
          dueDate: { lt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000) },
        },
        _sum: { value: true },
        _count: true,
      }),

      // Top 5 atrasados
      this.prisma.mensalidade.findMany({
        where: {
          gymId,
          status: { in: ['PENDING', 'LATE'] },
          dueDate: { lt: today },
        },
        orderBy: { dueDate: 'asc' },
        take: 5,
        include: { student: { select: { id: true, name: true, whatsapp: true } } },
      }),
    ]);

    const mrr = activePlans.reduce((sum, p) => {
      return sum + Number(p.value) * p._count.students;
    }, 0);

    return {
      mrr,
      receivedThisMonth: Number(receivedThisMonth._sum.value ?? 0),
      pendingThisMonth: Number(pendingThisMonth._sum.value ?? 0),
      lateAmount: Number(lateTotal._sum.value ?? 0),
      lateCount: lateTotal._count,
      inadimplenciaRate: mrr > 0 ? (Number(lateTotal._sum.value ?? 0) / mrr) * 100 : 0,
      topLate: recentMensalidades,
    };
  }

  async getCashflowWeekly(gymId: string) {
    const today = new Date();
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const start = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const end = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);

      const received = await this.prisma.mensalidade.aggregate({
        where: { gymId, status: 'PAID', paidAt: { gte: start, lt: end } },
        _sum: { value: true },
      });

      days.push({
        day: start.toLocaleDateString('pt-BR', { weekday: 'short' }),
        date: start.toISOString().split('T')[0],
        amount: Number(received._sum.value ?? 0),
      });
    }

    return days;
  }
}
