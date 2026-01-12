import { RefreshTokenCommand } from '@modules/auth/application/commands/refresh-token/refresh-token.command';
import { RefreshTokenResponseDto } from '@modules/auth/application/commands/refresh-token/refresh-token.response.dto';
import { AuthTokenPolicyService } from '@modules/auth/domain/services/auth-token.policy.service';
import { UserFacade } from '@modules/user/api/user.facade';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@shared/core/exceptions/common.exceptions';
import { JwtPayload } from '@shared/core/interfaces/jwt-payload.interface';
import { HashServicePort } from '@shared/domain/ports/hash.service.port';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<
  RefreshTokenCommand,
  RefreshTokenResponseDto
> {
  constructor(
    private readonly userFacade: UserFacade,
    private readonly jwtService: JwtService,
    private readonly tokenPolicy: AuthTokenPolicyService,
    private readonly hashService: HashServicePort
  ) {}

  async execute(command: RefreshTokenCommand): Promise<RefreshTokenResponseDto> {
    const { refreshToken } = command.dto;

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(
        refreshToken,
        this.tokenPolicy.getRefreshVerifyOptions()
      );
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.userFacade.findOneByEmailForAuth(payload.email);
    if (!user || !user.refreshTokenHashed) {
      throw new UnauthorizedException('Access denied token invalid');
    }

    const isMatching = await this.hashService.compare(refreshToken, user.refreshTokenHashed);
    if (!isMatching) {
      await this.userFacade.updateRefreshToken(user.id, null);
      throw new UnauthorizedException('Refresh token reuse detected. Please login again.');
    }

    const newPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: 'ACCESS',
    };
    const newRefreshPayload: JwtPayload = { ...newPayload, type: 'REFRESH' };

    const newAccessToken = this.jwtService.sign(newPayload, this.tokenPolicy.getAccessOptions());
    const newRefreshToken = this.jwtService.sign(
      newRefreshPayload,
      this.tokenPolicy.getRefreshOptions()
    );

    const newRefreshHash = await this.hashService.generate(newRefreshToken, 10);
    await this.userFacade.updateRefreshToken(user.id, newRefreshHash);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
