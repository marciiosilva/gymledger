import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { AuthGuard } from './auth.guard';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

const mockConfigService = {
  getOrThrow: jest.fn().mockReturnValue('fake-value'),
};

const mockPrisma = {
  user: { findUnique: jest.fn() },
};

const mockUser = {
  id: 'user-1',
  gymId: 'gym-1',
  supabaseUid: 'supa-uid',
  gym: { id: 'gym-1', name: 'Academia Teste' },
};

function buildContext(headers: Record<string, string> = {}): ExecutionContext {
  const mockRequest = { headers, user: undefined, gymId: undefined };
  return {
    switchToHttp: () => ({ getRequest: () => mockRequest }),
  } as unknown as ExecutionContext;
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockSupabaseAuth: any;

  beforeEach(async () => {
    jest.clearAllMocks();

    mockSupabaseAuth = { getUser: jest.fn() };
    (createClient as jest.Mock).mockReturnValue({ auth: mockSupabaseAuth });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  describe('canActivate', () => {
    it('retorna true e injeta user e gymId na request quando token válido', async () => {
      mockSupabaseAuth.getUser.mockResolvedValue({
        data: { user: { id: 'supa-uid' } },
        error: null,
      });
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const ctx = buildContext({ authorization: 'Bearer valid-token' });
      const result = await guard.canActivate(ctx);

      expect(result).toBe(true);
      const req = ctx.switchToHttp().getRequest();
      expect(req.user).toEqual(mockUser);
      expect(req.gymId).toBe('gym-1');
    });

    it('lança UnauthorizedException quando header Authorization está ausente', async () => {
      const ctx = buildContext({});

      await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
    });

    it('mensagem de erro indica token ausente', async () => {
      const ctx = buildContext({});

      await expect(guard.canActivate(ctx)).rejects.toThrow('Token ausente');
    });

    it('lança UnauthorizedException quando prefixo não é Bearer', async () => {
      const ctx = buildContext({ authorization: 'Basic abc123' });

      await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
    });

    it('lança UnauthorizedException quando supabase retorna erro de token', async () => {
      mockSupabaseAuth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Token expired' },
      });
      const ctx = buildContext({ authorization: 'Bearer expired-token' });

      await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
    });

    it('mensagem de erro indica token inválido', async () => {
      mockSupabaseAuth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'expired' },
      });
      const ctx = buildContext({ authorization: 'Bearer bad-token' });

      await expect(guard.canActivate(ctx)).rejects.toThrow('Token inválido');
    });

    it('lança UnauthorizedException quando usuário não existe no banco', async () => {
      mockSupabaseAuth.getUser.mockResolvedValue({
        data: { user: { id: 'supa-uid' } },
        error: null,
      });
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const ctx = buildContext({ authorization: 'Bearer valid-token' });

      await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
    });

    it('mensagem de erro indica usuário não encontrado', async () => {
      mockSupabaseAuth.getUser.mockResolvedValue({
        data: { user: { id: 'supa-uid' } },
        error: null,
      });
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const ctx = buildContext({ authorization: 'Bearer valid-token' });

      await expect(guard.canActivate(ctx)).rejects.toThrow('Usuário não encontrado');
    });

    it('não chama prisma quando token está ausente', async () => {
      const ctx = buildContext({});

      await expect(guard.canActivate(ctx)).rejects.toThrow();
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('não chama prisma quando supabase rejeita o token', async () => {
      mockSupabaseAuth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'invalid' },
      });
      const ctx = buildContext({ authorization: 'Bearer bad' });

      await expect(guard.canActivate(ctx)).rejects.toThrow();
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    });
  });
});
