import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PrismaService } from '../prisma/prisma.service';

const GYM_ID = 'gym-1';
const PLAN_ID = 'plan-1';

const mockPlan = {
  id: PLAN_ID,
  gymId: GYM_ID,
  name: 'Mensal Básico',
  value: 100,
  periodicity: 'MONTHLY',
  dueDayOfMonth: 10,
  paymentMethod: 'PIX',
  active: true,
  createdAt: new Date('2025-01-01'),
  _count: { students: 3 },
};

const mockPrisma = {
  plan: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findFirstOrThrow: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

describe('PlansService', () => {
  let service: PlansService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlansService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PlansService>(PlansService);
    prisma = module.get(PrismaService);
  });

  describe('findAll', () => {
    it('retorna planos da academia', async () => {
      prisma.plan.findMany.mockResolvedValue([mockPlan]);

      const result = await service.findAll(GYM_ID);

      expect(result).toEqual([mockPlan]);
      expect(prisma.plan.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { gymId: GYM_ID } }),
      );
    });

    it('retorna lista vazia quando academia não tem planos', async () => {
      prisma.plan.findMany.mockResolvedValue([]);

      const result = await service.findAll(GYM_ID);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('retorna plano pelo id', async () => {
      prisma.plan.findFirstOrThrow.mockResolvedValue(mockPlan);

      const result = await service.findOne(GYM_ID, PLAN_ID);

      expect(result).toEqual(mockPlan);
      expect(prisma.plan.findFirstOrThrow).toHaveBeenCalledWith({
        where: { id: PLAN_ID, gymId: GYM_ID },
      });
    });

    it('propaga erro quando plano não existe', async () => {
      prisma.plan.findFirstOrThrow.mockRejectedValue(new Error('Not found'));

      await expect(service.findOne(GYM_ID, 'invalid')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('cria plano com gymId', async () => {
      const dto = {
        name: 'Mensal',
        value: 150,
        periodicity: 'MONTHLY' as any,
        dueDayOfMonth: 15,
      };
      prisma.plan.create.mockResolvedValue({ ...mockPlan, ...dto, gymId: GYM_ID });

      const result = await service.create(GYM_ID, dto);

      expect(prisma.plan.create).toHaveBeenCalledWith({
        data: { ...dto, gymId: GYM_ID },
      });
      expect(result.gymId).toBe(GYM_ID);
    });
  });

  describe('update', () => {
    it('atualiza plano existente', async () => {
      prisma.plan.findFirst.mockResolvedValue(mockPlan);
      prisma.plan.update.mockResolvedValue({ ...mockPlan, name: 'Novo Nome' });

      const result = await service.update(GYM_ID, PLAN_ID, { name: 'Novo Nome' });

      expect(result.name).toBe('Novo Nome');
      expect(prisma.plan.update).toHaveBeenCalledWith({
        where: { id: PLAN_ID },
        data: { name: 'Novo Nome' },
      });
    });

    it('lança NotFoundException quando plano não encontrado', async () => {
      prisma.plan.findFirst.mockResolvedValue(null);

      await expect(service.update(GYM_ID, 'bad-id', { name: 'x' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('NotFoundException tem mensagem correta', async () => {
      prisma.plan.findFirst.mockResolvedValue(null);

      await expect(service.update(GYM_ID, 'bad-id', {})).rejects.toThrow(
        'Plano não encontrado',
      );
    });
  });

  describe('remove', () => {
    it('faz soft-delete setando active: false', async () => {
      prisma.plan.findFirst.mockResolvedValue(mockPlan);
      prisma.plan.update.mockResolvedValue({ ...mockPlan, active: false });

      await service.remove(GYM_ID, PLAN_ID);

      expect(prisma.plan.update).toHaveBeenCalledWith({
        where: { id: PLAN_ID },
        data: { active: false },
      });
    });

    it('lança NotFoundException quando plano não encontrado', async () => {
      prisma.plan.findFirst.mockResolvedValue(null);

      await expect(service.remove(GYM_ID, 'bad-id')).rejects.toThrow(NotFoundException);
    });

    it('não chama update quando plano não existe', async () => {
      prisma.plan.findFirst.mockResolvedValue(null);

      await expect(service.remove(GYM_ID, 'bad-id')).rejects.toThrow();
      expect(prisma.plan.update).not.toHaveBeenCalled();
    });
  });
});
