import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MarkPaidBatchDto, MarkPaidDto } from './dto/mensalidade.dto';

@Injectable()
export class MensalidadesService {
  constructor(private prisma: PrismaService) {}

  findAll(gymId: string, status?: string) {
    return this.prisma.mensalidade.findMany({
      where: { gymId, ...(status ? { status: status as any } : {}) },
      orderBy: { dueDate: 'desc' },
      include: {
        student: { select: { id: true, name: true, whatsapp: true } },
      },
    });
  }

  findByStudent(gymId: string, studentId: string) {
    return this.prisma.mensalidade.findMany({
      where: { gymId, studentId },
      orderBy: { dueDate: 'desc' },
    });
  }

  async markPaid(gymId: string, id: string, dto: MarkPaidDto) {
    const paidAt = dto.paidAt ? new Date(dto.paidAt) : new Date();

    const mensalidade = await this.prisma.mensalidade.update({
      where: { id },
      data: { status: 'PAID', paidAt, paidMethod: dto.paidMethod as any },
    });

    await this.updateStudentFinancialStatus(gymId, mensalidade.studentId);
    return mensalidade;
  }

  async markPaidBatch(gymId: string, dto: MarkPaidBatchDto) {
    const paidAt = dto.paidAt ? new Date(dto.paidAt) : new Date();

    await this.prisma.mensalidade.updateMany({
      where: { id: { in: dto.ids }, gymId },
      data: { status: 'PAID', paidAt, paidMethod: dto.paidMethod as any },
    });

    // Atualiza status financeiro dos alunos afetados
    const mensalidades = await this.prisma.mensalidade.findMany({
      where: { id: { in: dto.ids } },
      select: { studentId: true },
    });
    const studentIds = [...new Set(mensalidades.map((m) => m.studentId))];
    await Promise.all(
      studentIds.map((sid) => this.updateStudentFinancialStatus(gymId, sid)),
    );
  }

  // Recalcula financialStatus do aluno com base nas mensalidades
  private async updateStudentFinancialStatus(gymId: string, studentId: string) {
    const today = new Date();
    const lateMensalidades = await this.prisma.mensalidade.count({
      where: {
        studentId,
        gymId,
        status: { in: ['PENDING', 'LATE'] },
        dueDate: { lt: today },
      },
    });

    await this.prisma.student.update({
      where: { id: studentId },
      data: {
        financialStatus: lateMensalidades > 0 ? 'LATE' : 'UP_TO_DATE',
      },
    });
  }
}
