import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentGymId } from '../auth/current-gym.decorator';
import { MarkPaidBatchDto, MarkPaidDto } from './dto/mensalidade.dto';
import { MensalidadesService } from './mensalidades.service';

@Controller('mensalidades')
@UseGuards(AuthGuard)
export class MensalidadesController {
  constructor(private readonly mensalidadesService: MensalidadesService) {}

  @Get()
  findAll(@CurrentGymId() gymId: string, @Query('status') status?: string) {
    return this.mensalidadesService.findAll(gymId, status);
  }

  @Get('student/:studentId')
  findByStudent(
    @CurrentGymId() gymId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.mensalidadesService.findByStudent(gymId, studentId);
  }

  @Patch(':id/paid')
  markPaid(
    @CurrentGymId() gymId: string,
    @Param('id') id: string,
    @Body() dto: MarkPaidDto,
  ) {
    return this.mensalidadesService.markPaid(gymId, id, dto);
  }

  @Post('batch/paid')
  markPaidBatch(@CurrentGymId() gymId: string, @Body() dto: MarkPaidBatchDto) {
    return this.mensalidadesService.markPaidBatch(gymId, dto);
  }
}
