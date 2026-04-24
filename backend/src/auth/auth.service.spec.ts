import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

const mockConfigService = {
  getOrThrow: jest.fn().mockReturnValue('fake-value'),
};

const mockPrisma = {
  gym: { create: jest.fn() },
  user: { findUnique: jest.fn() },
};

describe('AuthService', () => {
  let service: AuthService;
  let mockSupabaseAuth: any;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockSupabaseAuth = {
      admin: { createUser: jest.fn() },
      signInWithPassword: jest.fn(),
    };
    (createClient as jest.Mock).mockReturnValue({ auth: mockSupabaseAuth });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    const dto = {
      gymName: 'Academia Teste',
      name: 'Luis Ferreira',
      email: 'luis@test.com',
      password: 'senha123',
    };

    it('cria usuário no supabase, academia no banco e retorna token', async () => {
      mockSupabaseAuth.admin.createUser.mockResolvedValue({
        data: { user: { id: 'supabase-uid' } },
        error: null,
      });
      mockPrisma.gym.create.mockResolvedValue({ id: 'gym-1', name: dto.gymName });
      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: { session: { access_token: 'jwt-token' } },
        error: null,
      });

      const result = await service.register(dto);

      expect(mockSupabaseAuth.admin.createUser).toHaveBeenCalledWith(
        expect.objectContaining({ email: dto.email, email_confirm: true }),
      );
      expect(mockPrisma.gym.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ name: dto.gymName, ownerEmail: dto.email }),
        }),
      );
      expect(result.accessToken).toBe('jwt-token');
      expect(result.gymId).toBe('gym-1');
    });

    it('lança BadRequestException quando supabase retorna erro no createUser', async () => {
      mockSupabaseAuth.admin.createUser.mockResolvedValue({
        data: null,
        error: { message: 'Email já cadastrado' },
      });

      await expect(service.register(dto)).rejects.toThrow(BadRequestException);
      expect(mockPrisma.gym.create).not.toHaveBeenCalled();
    });

    it('BadRequestException tem mensagem do supabase', async () => {
      mockSupabaseAuth.admin.createUser.mockResolvedValue({
        data: null,
        error: { message: 'Email já cadastrado' },
      });

      await expect(service.register(dto)).rejects.toThrow('Email já cadastrado');
    });

    it('lança BadRequestException quando login automático falha após registro', async () => {
      mockSupabaseAuth.admin.createUser.mockResolvedValue({
        data: { user: { id: 'supabase-uid' } },
        error: null,
      });
      mockPrisma.gym.create.mockResolvedValue({ id: 'gym-1', name: dto.gymName });
      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Falha no login' },
      });

      await expect(service.register(dto)).rejects.toThrow(BadRequestException);
    });

    it('cria usuário com role ADMIN na academia', async () => {
      mockSupabaseAuth.admin.createUser.mockResolvedValue({
        data: { user: { id: 'supabase-uid' } },
        error: null,
      });
      mockPrisma.gym.create.mockResolvedValue({ id: 'gym-1', name: dto.gymName });
      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: { session: { access_token: 'token' } },
        error: null,
      });

      await service.register(dto);

      const gymCreateCall = mockPrisma.gym.create.mock.calls[0][0];
      expect(gymCreateCall.data.users.create.role).toBe('ADMIN');
      expect(gymCreateCall.data.users.create.supabaseUid).toBe('supabase-uid');
    });
  });

  describe('login', () => {
    const dto = { email: 'luis@test.com', password: 'senha123' };

    it('retorna token e dados do usuário quando credenciais válidas', async () => {
      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: {
          user: { id: 'supabase-uid' },
          session: { access_token: 'jwt-token' },
        },
        error: null,
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        gymId: 'gym-1',
        name: 'Luis Ferreira',
        role: 'ADMIN',
        gym: { name: 'Academia Teste' },
      });

      const result = await service.login(dto);

      expect(result.accessToken).toBe('jwt-token');
      expect(result.gymId).toBe('gym-1');
      expect(result.role).toBe('ADMIN');
    });

    it('lança UnauthorizedException quando supabase retorna erro', async () => {
      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' },
      });

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('UnauthorizedException tem mensagem padrão de credenciais inválidas', async () => {
      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'invalid' },
      });

      await expect(service.login(dto)).rejects.toThrow('Credenciais inválidas');
    });

    it('lança UnauthorizedException quando usuário não existe no banco', async () => {
      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: {
          user: { id: 'supabase-uid' },
          session: { access_token: 'token' },
        },
        error: null,
      });
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('busca usuário pelo supabaseUid retornado', async () => {
      mockSupabaseAuth.signInWithPassword.mockResolvedValue({
        data: {
          user: { id: 'supa-123' },
          session: { access_token: 'token' },
        },
        error: null,
      });
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'u1',
        gymId: 'g1',
        name: 'Luis',
        role: 'ADMIN',
        gym: { name: 'Academia' },
      });

      await service.login(dto);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { supabaseUid: 'supa-123' },
        include: { gym: true },
      });
    });
  });
});
