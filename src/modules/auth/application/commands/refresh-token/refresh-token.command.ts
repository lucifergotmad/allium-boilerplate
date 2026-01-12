import { RefreshTokenRequestDto } from '@modules/auth/application/commands/refresh-token/refresh-token.request.dto';
import { ICommand } from '@nestjs/cqrs';

export class RefreshTokenCommand implements ICommand {
  constructor(public readonly dto: RefreshTokenRequestDto) {}
}
