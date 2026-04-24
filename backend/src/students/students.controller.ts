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
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
import { StudentsService } from './students.service';

@Controller('students')
@UseGuards(AuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  findAll(@CurrentGymId() gymId: string) {
    return this.studentsService.findAll(gymId);
  }

  @Get(':id')
  findOne(@CurrentGymId() gymId: string, @Param('id') id: string) {
    return this.studentsService.findOne(gymId, id);
  }

  @Post()
  create(@CurrentGymId() gymId: string, @Body() dto: CreateStudentDto) {
    return this.studentsService.create(gymId, dto);
  }

  @Patch(':id')
  update(
    @CurrentGymId() gymId: string,
    @Param('id') id: string,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentsService.update(gymId, id, dto);
  }

  @Delete(':id')
  deactivate(@CurrentGymId() gymId: string, @Param('id') id: string) {
    return this.studentsService.deactivate(gymId, id);
  }
}
