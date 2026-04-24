import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  findAll(gymId: string) {
    return this.prisma.plan.findMany({
      where: { gymId },
      orderBy: { createdAt: 'asc' },
      include: {
        _count: { select: { students: { where: { status: 'ACTIVE' } } } },
      },
    });
  }

  findOne(gymId: string, id: string) {
    return this.prisma.plan.findFirstOrThrow({ where: { id, gymId } });
  }

  create(gymId: string, dto: CreatePlanDto) {
    return this.prisma.plan.create({
      data: { ...dto, gymId },
    });
  }

  async update(gymId: string, id: string, dto: UpdatePlanDto) {
    await this.assertExists(gymId, id);
    return this.prisma.plan.update({ where: { id }, data: dto });
  }

  async remove(gymId: string, id: string) {
    await this.assertExists(gymId, id);
    return this.prisma.plan.update({
      where: { id },
      data: { active: false },
    });
  }

  private async assertExists(gymId: string, id: string) {
    const plan = await this.prisma.plan.findFirst({ where: { id, gymId } });
    if (!plan) throw new NotFoundException('Plano não encontrado');
  }
}
