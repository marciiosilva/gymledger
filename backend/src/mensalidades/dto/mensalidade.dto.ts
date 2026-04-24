import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentMethod } from '../../plans/dto/plan.dto';

export class MarkPaidDto {
  @IsEnum(PaymentMethod) paidMethod: PaymentMethod;
  @IsDateString() @IsOptional() paidAt?: string;
}

export class MarkPaidBatchDto {
  @IsString({ each: true }) ids: string[];
  @IsEnum(PaymentMethod) paidMethod: PaymentMethod;
  @IsDateString() @IsOptional() paidAt?: string;
}
