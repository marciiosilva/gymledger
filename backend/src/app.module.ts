import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { GymsModule } from './gyms/gyms.module';
import { MensalidadesModule } from './mensalidades/mensalidades.module';
import { PlansModule } from './plans/plans.module';
import { PrismaModule } from './prisma/prisma.module';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    GymsModule,
    PlansModule,
    StudentsModule,
    MensalidadesModule,
    DashboardModule,
  ],
})
export class AppModule {}
