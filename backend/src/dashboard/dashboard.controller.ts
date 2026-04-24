import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentGymId } from '../auth/current-gym.decorator';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  getMetrics(@CurrentGymId() gymId: string) {
    return this.dashboardService.getMetrics(gymId);
  }

  @Get('cashflow/weekly')
  getCashflowWeekly(@CurrentGymId() gymId: string) {
    return this.dashboardService.getCashflowWeekly(gymId);
  }
}
