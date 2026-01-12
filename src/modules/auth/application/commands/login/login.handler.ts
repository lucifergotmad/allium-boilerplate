import { LoginCommand } from '@modules/auth/application/commands/login/login.command';
import { LoginResponseDto } from '@modules/auth/application/commands/login/login.response.dto';
import { AuthTokenPolicyService } from '@modules/auth/domain/services/auth-token.policy.service';
import { UserFacade } from '@modules/user/api/user.facade';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@shared/core/exceptions/common.exceptions';
import { JwtPayload } from '@shared/core/interfaces/jwt-payload.interface';
import { HashServicePort } from '@shared/domain/ports/hash.service.port';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand, LoginResponseDto> {
  constructor(
    private readonly userFacade: UserFacade,
    private readonly jwtService: JwtService,
    private readonly tokenPolicy: AuthTokenPolicyService,
    private readonly hashService: HashServicePort
  ) {}

  async execute(command: LoginCommand): Promise<LoginResponseDto> {
    const { email, password } = command.dto;

    const user = await this.userFacade.findOneByEmailForAuth(email);
    if (!user) throw new UnauthorizedException('Email atau Password yang anda masukkan salah!');

    const isPasswordValid = await this.hashService.compare(password, user.passwordHashed);
    if (!isPasswordValid)
      throw new UnauthorizedException('Email atau Password yang anda masukkan salah!');

    const accessPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'ACCESS',
    };
    const refreshPayload: JwtPayload = { ...accessPayload, type: 'REFRESH' };

    const accessToken = this.jwtService.sign(accessPayload, this.tokenPolicy.getAccessOptions());
    const refreshToken = this.jwtService.sign(refreshPayload, this.tokenPolicy.getRefreshOptions());

    const refreshHashed = await this.hashService.generate(refreshToken, 10);
    await this.userFacade.updateRefreshToken(user.id, refreshHashed);

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}
