import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './auth.controller';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    this.supabase = createClient(
      config.getOrThrow('SUPABASE_URL'),
      config.getOrThrow('SUPABASE_SERVICE_ROLE_KEY'),
    );
  }

  async register(dto: RegisterDto) {
    const { data, error } = await this.supabase.auth.admin.createUser({
      email: dto.email,
      password: dto.password,
      email_confirm: true,
    });

    if (error) throw new BadRequestException(error.message);

    const gym = await this.prisma.gym.create({
      data: {
        name: dto.gymName,
        ownerEmail: dto.email,
        users: {
          create: {
            supabaseUid: data.user.id,
            email: dto.email,
            name: dto.name,
            role: 'ADMIN',
          },
        },
      },
    });

    // Login automático após registro
    const { data: session, error: loginError } =
      await this.supabase.auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

    if (loginError) throw new BadRequestException(loginError.message);

    return {
      accessToken: session.session.access_token,
      gymId: gym.id,
      gymName: gym.name,
    };
  }

  async login(dto: LoginDto) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error) throw new UnauthorizedException('Credenciais inválidas');

    const user = await this.prisma.user.findUnique({
      where: { supabaseUid: data.user.id },
      include: { gym: true },
    });

    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    return {
      accessToken: data.session.access_token,
      gymId: user.gymId,
      gymName: user.gym.name,
      userName: user.name,
      role: user.role,
    };
  }
}
