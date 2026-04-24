import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStudentDto {
  @IsString() name: string;
  @IsEmail() @IsOptional() email?: string;
  @IsString() @IsOptional() whatsapp?: string;
  @IsString() planId: string;
  @IsDateString() startDate: string;
}

export class UpdateStudentDto {
  @IsString() @IsOptional() name?: string;
  @IsEmail() @IsOptional() email?: string;
  @IsString() @IsOptional() whatsapp?: string;
  @IsString() @IsOptional() planId?: string;
}
