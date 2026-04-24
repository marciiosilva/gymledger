import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() @IsNotEmpty() gymName: string;
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() name: string;
  @IsString() @MinLength(6) password: string;
}

export class LoginDto {
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
