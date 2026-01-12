import { LoginRequestDto } from '@modules/auth/application/commands/login/login.request.dto';
import { ICommand } from '@nestjs/cqrs';

export class LoginCommand implements ICommand {
  constructor(public readonly dto: LoginRequestDto) {}
}
