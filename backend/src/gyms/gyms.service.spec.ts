import { Test, TestingModule } from '@nestjs/testing';
import { GymsService } from './gyms.service';
import { PrismaService } from '../prisma/prisma.service';

const GYM_ID = 'gym-1';

const mockGym = {
  id: GYM_ID,
  name: 'Academia Teste',
  ownerEmail: 'owner@test.com',
  _count: { students: 42, plans: 3 },
};

const mockPrisma = {
  gym: {
    findUniqueOrThrow: jest.fn(),
  },
};

describe('GymsService', () => {
  let service: GymsService;
  let prisma: typeof mockPrisma;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GymsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<GymsService>(GymsService);
    prisma = module.get(PrismaService);
  });

  describe('findOne', () => {
    it('retorna academia com contagem de alunos e planos', async () => {
      prisma.gym.findUniqueOrThrow.mockResolvedValue(mockGym);

      const result = await service.findOne(GYM_ID);

      expect(result).toEqual(mockGym);
      expect(prisma.gym.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: GYM_ID },
        include: { _count: { select: { students: true, plans: true } } },
      });
    });

    it('propaga erro quando academia não existe', async () => {
      prisma.gym.findUniqueOrThrow.mockRejectedValue(new Error('Not found'));

      await expect(service.findOne('invalid-id')).rejects.toThrow();
    });
  });
});
