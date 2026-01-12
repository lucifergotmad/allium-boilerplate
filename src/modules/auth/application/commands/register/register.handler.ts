import { RegisterCommand } from '@modules/auth/application/commands/register/register.command';
import { RegisterResponseDto } from '@modules/auth/application/commands/register/register.response.dto';
import { AuthTokenPolicyService } from '@modules/auth/domain/services/auth-token.policy.service';
import { UserFacade } from '@modules/user/api/user.facade';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@shared/core/interfaces/jwt-payload.interface';
import { HashServicePort } from '@shared/domain/ports/hash.service.port';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand, RegisterResponseDto> {
  constructor(
    private readonly userFacade: UserFacade,
    private readonly jwtService: JwtService,
    private readonly tokenPolicy: AuthTokenPolicyService,
    private readonly hashService: HashServicePort
  ) {}

  async execute(command: RegisterCommand): Promise<RegisterResponseDto> {
    const newUser = await this.userFacade.createUser(command.dto);

    const accessPayload: JwtPayload = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
      type: 'ACCESS',
    };
    const refreshPayload: JwtPayload = { ...accessPayload, type: 'REFRESH' };

    const accessToken = this.jwtService.sign(accessPayload, this.tokenPolicy.getAccessOptions());
    const refreshToken = this.jwtService.sign(refreshPayload, this.tokenPolicy.getRefreshOptions());

    const refreshHashed = await this.hashService.generate(refreshToken, 10);
    await this.userFacade.updateRefreshToken(newUser.id, refreshHashed);

    return { accessToken, refreshToken, user: newUser };
  }
}
