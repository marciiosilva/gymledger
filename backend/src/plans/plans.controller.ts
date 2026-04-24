import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentGymId } from '../auth/current-gym.decorator';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto';
import { PlansService } from './plans.service';

@Controller('plans')
@UseGuards(AuthGuard)
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  findAll(@CurrentGymId() gymId: string) {
    return this.plansService.findAll(gymId);
  }

  @Get(':id')
  findOne(@CurrentGymId() gymId: string, @Param('id') id: string) {
    return this.plansService.findOne(gymId, id);
  }

  @Post()
  create(@CurrentGymId() gymId: string, @Body() dto: CreatePlanDto) {
    return this.plansService.create(gymId, dto);
  }

  @Patch(':id')
  update(
    @CurrentGymId() gymId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePlanDto,
  ) {
    return this.plansService.update(gymId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentGymId() gymId: string, @Param('id') id: string) {
    return this.plansService.remove(gymId, id);
  }
}
