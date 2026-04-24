import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { StudentsService } from './students.service';
import { PrismaService } from '../prisma/prisma.service';

const GYM_ID = 'gym-1';
const STUDENT_ID = 'student-1';
const PLAN_ID = 'plan-1';

const mockPlan = {
  id: PLAN_ID,
  gymId: GYM_ID,
  name: 'Mensal Básico',
  value: 100,
  dueDayOfMonth: 10,
  periodicity: 'MONTHLY',
  active: true,
};

const mockStudent = {
  id: STUDENT_ID,
  gymId: GYM_ID,
  name: 'João Silva',
  email: 'joao@test.com',
  whatsapp: '11999999999',
  planId: PLAN_ID,
  startDate: new Date('2025-01-15'),
  status: 'ACTIVE',
  financialStatus: 'UP_TO_DATE',
  plan: mockPlan,
  mensalidades: [],
  _count: { mensalidades: 0 },
};

const mockPrisma = {
  plan: {
    findFirst: jest.fn(),
  },
  student: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findFirstOrThrow: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  mensalidade: {
    createMany: jest.fn(),
    updateMany: jest.fn(),
  },
  $transaction: jest.fn(),
};

describe('StudentsService', () => {
  let service: StudentsService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-15T12:00:00Z'));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('findAll', () => {
    it('retorna alunos da academia em ordem alfabética', async () => {
      prisma.student.findMany.mockResolvedValue([mockStudent]);

      const result = await service.findAll(GYM_ID);

      expect(result).toEqual([mockStudent]);
      expect(prisma.student.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { gymId: GYM_ID },
          orderBy: { name: 'asc' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('retorna aluno com plano e mensalidades', async () => {
      prisma.student.findFirstOrThrow.mockResolvedValue(mockStudent);

      const result = await service.findOne(GYM_ID, STUDENT_ID);

      expect(result).toEqual(mockStudent);
      expect(prisma.student.findFirstOrThrow).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: STUDENT_ID, gymId: GYM_ID } }),
      );
    });

    it('propaga erro quando aluno não existe', async () => {
      prisma.student.findFirstOrThrow.mockRejectedValue(new Error('Not found'));

      await expect(service.findOne(GYM_ID, 'invalid')).rejects.toThrow();
    });
  });

  describe('create', () => {
    const dto = {
      name: 'Maria Costa',
      email: 'maria@test.com',
      whatsapp: '11988887777',
      planId: PLAN_ID,
      startDate: '2025-01-15',
    };

    it('cria aluno e gera mensalidades', async () => {
      prisma.plan.findFirst.mockResolvedValue(mockPlan);
      prisma.student.create.mockResolvedValue({ ...mockStudent, name: dto.name });
      prisma.mensalidade.createMany.mockResolvedValue({ count: 12 });
      prisma.student.findFirstOrThrow.mockResolvedValue({ ...mockStudent, name: dto.name });

      const result = await service.create(GYM_ID, dto);

      expect(prisma.student.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ gymId: GYM_ID, planId: PLAN_ID }),
        }),
      );
      expect(prisma.mensalidade.createMany).toHaveBeenCalled();
      expect(result.name).toBe(dto.name);
    });

    it('gera mensalidades com gymId e studentId corretos', async () => {
      prisma.plan.findFirst.mockResolvedValue(mockPlan);
      prisma.student.create.mockResolvedValue(mockStudent);
      prisma.mensalidade.createMany.mockResolvedValue({ count: 12 });
      prisma.student.findFirstOrThrow.mockResolvedValue(mockStudent);

      await service.create(GYM_ID, dto);

      const createManyCall = prisma.mensalidade.createMany.mock.calls[0][0];
      expect(createManyCall.data[0].gymId).toBe(GYM_ID);
      expect(createManyCall.data[0].studentId).toBe(STUDENT_ID);
    });

    it('gera mensalidade do mês atual como LATE quando dia já passou', async () => {
      // today = 2025-01-15, dueDayOfMonth = 10 → jan/2025 já venceu
      prisma.plan.findFirst.mockResolvedValue(mockPlan);
      prisma.student.create.mockResolvedValue(mockStudent);
      prisma.mensalidade.createMany.mockResolvedValue({ count: 12 });
      prisma.student.findFirstOrThrow.mockResolvedValue(mockStudent);

      await service.create(GYM_ID, dto);

      const { data } = prisma.mensalidade.createMany.mock.calls[0][0];
      const firstEntry = data[0];
      expect(firstEntry.status).toBe('LATE');
    });

    it('gera mensalidades futuras como PENDING', async () => {
      prisma.plan.findFirst.mockResolvedValue(mockPlan);
      prisma.student.create.mockResolvedValue(mockStudent);
      prisma.mensalidade.createMany.mockResolvedValue({ count: 12 });
      prisma.student.findFirstOrThrow.mockResolvedValue(mockStudent);

      await service.create(GYM_ID, dto);

      const { data } = prisma.mensalidade.createMany.mock.calls[0][0];
      const futureEntries = data.slice(1);
      futureEntries.forEach((m: any) => expect(m.status).toBe('PENDING'));
    });

    it('usa reference no formato YYYY-MM', async () => {
      prisma.plan.findFirst.mockResolvedValue(mockPlan);
      prisma.student.create.mockResolvedValue(mockStudent);
      prisma.mensalidade.createMany.mockResolvedValue({ count: 12 });
      prisma.student.findFirstOrThrow.mockResolvedValue(mockStudent);

      await service.create(GYM_ID, dto);

      const { data } = prisma.mensalidade.createMany.mock.calls[0][0];
      expect(data[0].reference).toMatch(/^\d{4}-\d{2}$/);
    });

    it('lança BadRequestException quando plano não encontrado', async () => {
      prisma.plan.findFirst.mockResolvedValue(null);

      await expect(service.create(GYM_ID, dto)).rejects.toThrow(BadRequestException);
      expect(prisma.student.create).not.toHaveBeenCalled();
    });

    it('BadRequestException tem mensagem correta', async () => {
      prisma.plan.findFirst.mockResolvedValue(null);

      await expect(service.create(GYM_ID, dto)).rejects.toThrow('Plano não encontrado');
    });
  });

  describe('update', () => {
    it('atualiza dados do aluno', async () => {
      prisma.student.findFirst.mockResolvedValue(mockStudent);
      prisma.student.update.mockResolvedValue({ ...mockStudent, name: 'Novo Nome' });

      const result = await service.update(GYM_ID, STUDENT_ID, { name: 'Novo Nome' });

      expect(result.name).toBe('Novo Nome');
      expect(prisma.student.update).toHaveBeenCalledWith({
        where: { id: STUDENT_ID },
        data: { name: 'Novo Nome' },
      });
    });

    it('lança NotFoundException quando aluno não encontrado', async () => {
      prisma.student.findFirst.mockResolvedValue(null);

      await expect(service.update(GYM_ID, 'bad-id', { name: 'x' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deactivate', () => {
    it('define status INACTIVE e cancela mensalidades pendentes', async () => {
      prisma.student.findFirst.mockResolvedValue(mockStudent);
      prisma.student.update.mockResolvedValue({ ...mockStudent, status: 'INACTIVE' });
      prisma.mensalidade.updateMany.mockResolvedValue({ count: 5 });
      prisma.$transaction.mockResolvedValue([{}, {}]);

      await service.deactivate(GYM_ID, STUDENT_ID);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.student.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: STUDENT_ID },
          data: { status: 'INACTIVE', financialStatus: 'CANCELLED' },
        }),
      );
      expect(prisma.mensalidade.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { studentId: STUDENT_ID, status: 'PENDING' },
          data: { status: 'CANCELLED' },
        }),
      );
    });

    it('lança NotFoundException quando aluno não encontrado', async () => {
      prisma.student.findFirst.mockResolvedValue(null);

      await expect(service.deactivate(GYM_ID, 'bad-id')).rejects.toThrow(NotFoundException);
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('NotFoundException tem mensagem correta', async () => {
      prisma.student.findFirst.mockResolvedValue(null);

      await expect(service.deactivate(GYM_ID, 'bad-id')).rejects.toThrow(
        'Aluno não encontrado',
      );
    });
  });
});
