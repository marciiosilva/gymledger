import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

const GYM_ID = 'gym-1';

const mockPrisma = {
  plan: {
    findMany: jest.fn(),
  },
  mensalidade: {
    aggregate: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('DashboardService', () => {
  let service: DashboardService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-15T12:00:00Z'));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getMetrics', () => {
    function setupMocks({
      plans = [],
      received = 0,
      pending = 0,
      lateAmount = 0,
      lateCount = 0,
      topLate = [],
    }: {
      plans?: any[];
      received?: number;
      pending?: number;
      lateAmount?: number;
      lateCount?: number;
      topLate?: any[];
    } = {}) {
      prisma.plan.findMany.mockResolvedValue(plans);
      prisma.mensalidade.aggregate
        .mockResolvedValueOnce({ _sum: { value: received } })
        .mockResolvedValueOnce({ _sum: { value: pending } })
        .mockResolvedValueOnce({ _sum: { value: lateAmount }, _count: lateCount });
      prisma.mensalidade.findMany.mockResolvedValue(topLate);
    }

    it('calcula MRR somando planos ativos × número de alunos', async () => {
      setupMocks({
        plans: [
          { id: 'p1', value: 100, _count: { students: 3 } },
          { id: 'p2', value: 200, _count: { students: 2 } },
        ],
      });

      const result = await service.getMetrics(GYM_ID);

      // MRR = (100 * 3) + (200 * 2) = 700
      expect(result.mrr).toBe(700);
    });

    it('retorna receivedThisMonth correto', async () => {
      setupMocks({ received: 1500 });

      const result = await service.getMetrics(GYM_ID);

      expect(result.receivedThisMonth).toBe(1500);
    });

    it('retorna pendingThisMonth correto', async () => {
      setupMocks({ pending: 800 });

      const result = await service.getMetrics(GYM_ID);

      expect(result.pendingThisMonth).toBe(800);
    });

    it('calcula inadimplenciaRate como percentual do MRR', async () => {
      setupMocks({
        plans: [{ id: 'p1', value: 100, _count: { students: 10 } }], // MRR = 1000
        lateAmount: 200,
        lateCount: 2,
      });

      const result = await service.getMetrics(GYM_ID);

      expect(result.inadimplenciaRate).toBe(20); // 200/1000 * 100
    });

    it('retorna inadimplenciaRate 0 quando MRR é zero', async () => {
      setupMocks({ plans: [], lateAmount: 500 });

      const result = await service.getMetrics(GYM_ID);

      expect(result.inadimplenciaRate).toBe(0);
    });

    it('retorna lateCount correto', async () => {
      setupMocks({ lateCount: 5 });

      const result = await service.getMetrics(GYM_ID);

      expect(result.lateCount).toBe(5);
    });

    it('retorna topLate com mensalidades atrasadas', async () => {
      const topLate = [
        { id: 'm1', studentId: 's1', dueDate: new Date('2024-12-10'), student: { name: 'João' } },
      ];
      setupMocks({ topLate });

      const result = await service.getMetrics(GYM_ID);

      expect(result.topLate).toEqual(topLate);
    });

    it('retorna zero para valores nulos do aggregate', async () => {
      prisma.plan.findMany.mockResolvedValue([]);
      prisma.mensalidade.aggregate
        .mockResolvedValueOnce({ _sum: { value: null } })
        .mockResolvedValueOnce({ _sum: { value: null } })
        .mockResolvedValueOnce({ _sum: { value: null }, _count: 0 });
      prisma.mensalidade.findMany.mockResolvedValue([]);

      const result = await service.getMetrics(GYM_ID);

      expect(result.receivedThisMonth).toBe(0);
      expect(result.pendingThisMonth).toBe(0);
      expect(result.lateAmount).toBe(0);
    });

    it('consulta planos apenas da academia correta', async () => {
      setupMocks();

      await service.getMetrics(GYM_ID);

      expect(prisma.plan.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { gymId: GYM_ID, active: true } }),
      );
    });
  });

  describe('getCashflowWeekly', () => {
    it('retorna exatamente 7 dias', async () => {
      prisma.mensalidade.aggregate.mockResolvedValue({ _sum: { value: 0 } });

      const result = await service.getCashflowWeekly(GYM_ID);

      expect(result).toHaveLength(7);
    });

    it('retorna amount correto para cada dia', async () => {
      prisma.mensalidade.aggregate
        .mockResolvedValueOnce({ _sum: { value: 100 } })
        .mockResolvedValueOnce({ _sum: { value: 200 } })
        .mockResolvedValueOnce({ _sum: { value: 0 } })
        .mockResolvedValueOnce({ _sum: { value: 150 } })
        .mockResolvedValueOnce({ _sum: { value: null } })
        .mockResolvedValueOnce({ _sum: { value: 300 } })
        .mockResolvedValueOnce({ _sum: { value: 50 } });

      const result = await service.getCashflowWeekly(GYM_ID);

      expect(result[0].amount).toBe(100);
      expect(result[4].amount).toBe(0); // null → 0
    });

    it('retorna date no formato ISO YYYY-MM-DD', async () => {
      prisma.mensalidade.aggregate.mockResolvedValue({ _sum: { value: 0 } });

      const result = await service.getCashflowWeekly(GYM_ID);

      result.forEach((day) => {
        expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it('último dia é o dia atual', async () => {
      prisma.mensalidade.aggregate.mockResolvedValue({ _sum: { value: 0 } });

      const result = await service.getCashflowWeekly(GYM_ID);

      expect(result[6].date).toBe('2025-01-15');
    });

    it('primeiro dia é 6 dias atrás', async () => {
      prisma.mensalidade.aggregate.mockResolvedValue({ _sum: { value: 0 } });

      const result = await service.getCashflowWeekly(GYM_ID);

      expect(result[0].date).toBe('2025-01-09');
    });
  });
});
