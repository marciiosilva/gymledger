import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentGymId } from '../auth/current-gym.decorator';
import { GymsService } from './gyms.service';

@Controller('gyms')
@UseGuards(AuthGuard)
export class GymsController {
  constructor(private readonly gymsService: GymsService) {}

  @Get('me')
  getMe(@CurrentGymId() gymId: string) {
    return this.gymsService.findOne(gymId);
  }
}
