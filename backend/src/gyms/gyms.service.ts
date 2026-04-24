import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GymsService {
  constructor(private prisma: PrismaService) {}

  findOne(gymId: string) {
    return this.prisma.gym.findUniqueOrThrow({
      where: { id: gymId },
      include: {
        _count: {
          select: { students: true, plans: true },
        },
      },
    });
  }
}
