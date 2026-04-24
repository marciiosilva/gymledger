import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum Periodicity {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMIANNUAL = 'SEMIANNUAL',
  ANNUAL = 'ANNUAL',
}

export enum PaymentMethod {
  PIX = 'PIX',
  CARD_MACHINE = 'CARD_MACHINE',
  CASH = 'CASH',
  EXTERNAL_LINK = 'EXTERNAL_LINK',
  OTHER = 'OTHER',
}

export class CreatePlanDto {
  @IsString() name: string;
  @IsNumber() value: number;
  @IsEnum(Periodicity) periodicity: Periodicity;
  @IsInt() @Min(1) @Max(28) dueDayOfMonth: number;
  @IsEnum(PaymentMethod) @IsOptional() paymentMethod?: PaymentMethod;
}

export class UpdatePlanDto {
  @IsString() @IsOptional() name?: string;
  @IsNumber() @IsOptional() value?: number;
  @IsEnum(Periodicity) @IsOptional() periodicity?: Periodicity;
  @IsInt() @Min(1) @Max(28) @IsOptional() dueDayOfMonth?: number;
  @IsEnum(PaymentMethod) @IsOptional() paymentMethod?: PaymentMethod;
  @IsBoolean() @IsOptional() active?: boolean;
}
