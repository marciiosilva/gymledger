import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  findAll(gymId: string) {
    return this.prisma.student.findMany({
      where: { gymId },
      orderBy: { name: 'asc' },
      include: {
        plan: { select: { id: true, name: true, value: true } },
        _count: { select: { mensalidades: true } },
      },
    });
  }

  findOne(gymId: string, id: string) {
    return this.prisma.student.findFirstOrThrow({
      where: { id, gymId },
      include: {
        plan: true,
        mensalidades: { orderBy: { dueDate: 'desc' } },
      },
    });
  }

  async create(gymId: string, dto: CreateStudentDto) {
    const plan = await this.prisma.plan.findFirst({
      where: { id: dto.planId, gymId },
    });
    if (!plan) throw new BadRequestException('Plano não encontrado');

    const student = await this.prisma.student.create({
      data: {
        gymId,
        planId: dto.planId,
        name: dto.name,
        email: dto.email,
        whatsapp: dto.whatsapp,
        startDate: new Date(dto.startDate),
      },
    });

    await this.generateMensalidades(gymId, student.id, plan, new Date(dto.startDate));

    return this.findOne(gymId, student.id);
  }

  async update(gymId: string, id: string, dto: UpdateStudentDto) {
    await this.assertExists(gymId, id);
    return this.prisma.student.update({ where: { id }, data: dto });
  }

  async deactivate(gymId: string, id: string) {
    await this.assertExists(gymId, id);
    await this.prisma.$transaction([
      this.prisma.student.update({
        where: { id },
        data: { status: 'INACTIVE', financialStatus: 'CANCELLED' },
      }),
      this.prisma.mensalidade.updateMany({
        where: { studentId: id, status: 'PENDING' },
        data: { status: 'CANCELLED' },
      }),
    ]);
  }

  // Gera mensalidades dos próximos 12 meses a partir da data de início
  private async generateMensalidades(
    gymId: string,
    studentId: string,
    plan: { value: any; dueDayOfMonth: number },
    startDate: Date,
  ) {
    const mensalidades = [];
    const today = new Date();

    for (let i = 0; i < 12; i++) {
      const dueDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + i,
        plan.dueDayOfMonth,
      );

      // Só gera futuras ou do mês atual
      if (dueDate < today && dueDate.getMonth() !== today.getMonth()) continue;

      const reference = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}`;

      mensalidades.push({
        gymId,
        studentId,
        dueDate,
        value: plan.value,
        reference,
        status: (dueDate < today ? 'LATE' : 'PENDING') as any,
      });
    }

    if (mensalidades.length > 0) {
      await this.prisma.mensalidade.createMany({
        data: mensalidades,
        skipDuplicates: true,
      });
    }
  }

  private async assertExists(gymId: string, id: string) {
    const s = await this.prisma.student.findFirst({ where: { id, gymId } });
    if (!s) throw new NotFoundException('Aluno não encontrado');
  }
}
