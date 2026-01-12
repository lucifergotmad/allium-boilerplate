import { LoginCommand } from '@modules/auth/application/commands/login/login.command';
import { LoginRequestDto } from '@modules/auth/application/commands/login/login.request.dto';
import { LoginResponseDto } from '@modules/auth/application/commands/login/login.response.dto';
import { RefreshTokenCommand } from '@modules/auth/application/commands/refresh-token/refresh-token.command';
import { RefreshTokenRequestDto } from '@modules/auth/application/commands/refresh-token/refresh-token.request.dto';
import { RefreshTokenResponseDto } from '@modules/auth/application/commands/refresh-token/refresh-token.response.dto';
import { RegisterCommand } from '@modules/auth/application/commands/register/register.command';
import { RegisterRequestDto } from '@modules/auth/application/commands/register/register.request.dto';
import { RegisterResponseDto } from '@modules/auth/application/commands/register/register.response.dto';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ResponseDto } from '@shared/application/dtos/base.response.dto';

@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  async register(@Body() dto: RegisterRequestDto) {
    const result = await this.commandBus.execute<RegisterCommand, RegisterResponseDto>(
      new RegisterCommand(dto)
    );
    return ResponseDto.success(result, 'User registered successfully', HttpStatus.CREATED);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginRequestDto) {
    const result = await this.commandBus.execute<LoginCommand, LoginResponseDto>(
      new LoginCommand(dto)
    );
    return ResponseDto.success(result, 'Login successful');
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenRequestDto) {
    const result = await this.commandBus.execute<RefreshTokenCommand, RefreshTokenResponseDto>(
      new RefreshTokenCommand(dto)
    );
    return ResponseDto.success(result, 'Token refreshed successfully');
  }
}
