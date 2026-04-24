import { Test, TestingModule } from '@nestjs/testing';
import { MensalidadesService } from './mensalidades.service';
import { PrismaService } from '../prisma/prisma.service';

const GYM_ID = 'gym-1';
const STUDENT_ID = 'student-1';
const MENSALIDADE_ID = 'mensalidade-1';

const mockMensalidade = {
  id: MENSALIDADE_ID,
  gymId: GYM_ID,
  studentId: STUDENT_ID,
  value: 100,
  dueDate: new Date('2025-01-10'),
  status: 'PENDING',
  reference: '2025-01',
  paidAt: null,
  paidMethod: null,
};

const mockPrisma = {
  mensalidade: {
    findMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    count: jest.fn(),
  },
  student: {
    update: jest.fn(),
  },
};

describe('MensalidadesService', () => {
  let service: MensalidadesService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-01-15T12:00:00Z'));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MensalidadesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<MensalidadesService>(MensalidadesService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('findAll', () => {
    it('retorna mensalidades da academia', async () => {
      prisma.mensalidade.findMany.mockResolvedValue([mockMensalidade]);

      const result = await service.findAll(GYM_ID);

      expect(result).toEqual([mockMensalidade]);
      expect(prisma.mensalidade.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { gymId: GYM_ID } }),
      );
    });

    it('filtra por status quando fornecido', async () => {
      prisma.mensalidade.findMany.mockResolvedValue([mockMensalidade]);

      await service.findAll(GYM_ID, 'LATE');

      expect(prisma.mensalidade.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { gymId: GYM_ID, status: 'LATE' },
        }),
      );
    });

    it('não inclui filtro de status quando não fornecido', async () => {
      prisma.mensalidade.findMany.mockResolvedValue([]);

      await service.findAll(GYM_ID);

      const call = prisma.mensalidade.findMany.mock.calls[0][0];
      expect(call.where).not.toHaveProperty('status');
    });
  });

  describe('findByStudent', () => {
    it('retorna mensalidades do aluno ordenadas por vencimento', async () => {
      prisma.mensalidade.findMany.mockResolvedValue([mockMensalidade]);

      const result = await service.findByStudent(GYM_ID, STUDENT_ID);

      expect(result).toEqual([mockMensalidade]);
      expect(prisma.mensalidade.findMany).toHaveBeenCalledWith({
        where: { gymId: GYM_ID, studentId: STUDENT_ID },
        orderBy: { dueDate: 'desc' },
      });
    });
  });

  describe('markPaid', () => {
    const dto = { paidMethod: 'PIX' as any };

    it('atualiza mensalidade para PAID', async () => {
      const paid = { ...mockMensalidade, status: 'PAID', paidAt: new Date(), paidMethod: 'PIX' };
      prisma.mensalidade.update.mockResolvedValue(paid);
      prisma.mensalidade.count.mockResolvedValue(0);
      prisma.student.update.mockResolvedValue({});

      const result = await service.markPaid(GYM_ID, MENSALIDADE_ID, dto);

      expect(result.status).toBe('PAID');
      expect(prisma.mensalidade.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: MENSALIDADE_ID },
          data: expect.objectContaining({ status: 'PAID', paidMethod: 'PIX' }),
        }),
      );
    });

    it('usa data fornecida no dto quando paidAt está presente', async () => {
      const dtoWithDate = { paidMethod: 'PIX' as any, paidAt: '2025-01-10' };
      const paid = { ...mockMensalidade, status: 'PAID' };
      prisma.mensalidade.update.mockResolvedValue(paid);
      prisma.mensalidade.count.mockResolvedValue(0);
      prisma.student.update.mockResolvedValue({});

      await service.markPaid(GYM_ID, MENSALIDADE_ID, dtoWithDate);

      const updateCall = prisma.mensalidade.update.mock.calls[0][0];
      expect(updateCall.data.paidAt).toEqual(new Date('2025-01-10'));
    });

    it('usa data atual quando paidAt não fornecido', async () => {
      const paid = { ...mockMensalidade, status: 'PAID' };
      prisma.mensalidade.update.mockResolvedValue(paid);
      prisma.mensalidade.count.mockResolvedValue(0);
      prisma.student.update.mockResolvedValue({});

      await service.markPaid(GYM_ID, MENSALIDADE_ID, dto);

      const updateCall = prisma.mensalidade.update.mock.calls[0][0];
      expect(updateCall.data.paidAt).toEqual(new Date('2025-01-15T12:00:00Z'));
    });

    it('recalcula status financeiro do aluno após pagamento', async () => {
      const paid = { ...mockMensalidade, status: 'PAID', studentId: STUDENT_ID };
      prisma.mensalidade.update.mockResolvedValue(paid);
      prisma.mensalidade.count.mockResolvedValue(0);
      prisma.student.update.mockResolvedValue({});

      await service.markPaid(GYM_ID, MENSALIDADE_ID, dto);

      expect(prisma.mensalidade.count).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ studentId: STUDENT_ID }) }),
      );
      expect(prisma.student.update).toHaveBeenCalled();
    });
  });

  describe('markPaidBatch', () => {
    const ids = ['m-1', 'm-2', 'm-3'];
    const dto = { ids, paidMethod: 'PIX' as any };

    it('atualiza várias mensalidades de uma vez', async () => {
      prisma.mensalidade.updateMany.mockResolvedValue({ count: 3 });
      prisma.mensalidade.findMany.mockResolvedValue([
        { studentId: STUDENT_ID },
        { studentId: STUDENT_ID },
        { studentId: 'student-2' },
      ]);
      prisma.mensalidade.count.mockResolvedValue(0);
      prisma.student.update.mockResolvedValue({});

      await service.markPaidBatch(GYM_ID, dto);

      expect(prisma.mensalidade.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: { in: ids }, gymId: GYM_ID },
          data: expect.objectContaining({ status: 'PAID' }),
        }),
      );
    });

    it('recalcula status financeiro de cada aluno único afetado', async () => {
      prisma.mensalidade.updateMany.mockResolvedValue({ count: 2 });
      prisma.mensalidade.findMany.mockResolvedValue([
        { studentId: STUDENT_ID },
        { studentId: 'student-2' },
      ]);
      prisma.mensalidade.count.mockResolvedValue(0);
      prisma.student.update.mockResolvedValue({});

      await service.markPaidBatch(GYM_ID, dto);

      expect(prisma.student.update).toHaveBeenCalledTimes(2);
    });

    it('não duplica recálculo para o mesmo aluno', async () => {
      prisma.mensalidade.updateMany.mockResolvedValue({ count: 2 });
      prisma.mensalidade.findMany.mockResolvedValue([
        { studentId: STUDENT_ID },
        { studentId: STUDENT_ID }, // mesmo aluno, 2 mensalidades
      ]);
      prisma.mensalidade.count.mockResolvedValue(0);
      prisma.student.update.mockResolvedValue({});

      await service.markPaidBatch(GYM_ID, dto);

      expect(prisma.student.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateStudentFinancialStatus (via markPaid)', () => {
    it('define LATE quando há mensalidades vencidas em aberto', async () => {
      const paid = { ...mockMensalidade, status: 'PAID', studentId: STUDENT_ID };
      prisma.mensalidade.update.mockResolvedValue(paid);
      prisma.mensalidade.count.mockResolvedValue(2); // 2 atrasadas
      prisma.student.update.mockResolvedValue({});

      await service.markPaid(GYM_ID, MENSALIDADE_ID, { paidMethod: 'PIX' as any });

      expect(prisma.student.update).toHaveBeenCalledWith({
        where: { id: STUDENT_ID },
        data: { financialStatus: 'LATE' },
      });
    });

    it('define UP_TO_DATE quando não há mensalidades vencidas', async () => {
      const paid = { ...mockMensalidade, status: 'PAID', studentId: STUDENT_ID };
      prisma.mensalidade.update.mockResolvedValue(paid);
      prisma.mensalidade.count.mockResolvedValue(0);
      prisma.student.update.mockResolvedValue({});

      await service.markPaid(GYM_ID, MENSALIDADE_ID, { paidMethod: 'PIX' as any });

      expect(prisma.student.update).toHaveBeenCalledWith({
        where: { id: STUDENT_ID },
        data: { financialStatus: 'UP_TO_DATE' },
      });
    });
  });
});
