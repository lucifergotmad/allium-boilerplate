import { ICommand } from '@nestjs/cqrs';
import { RegisterRequestDto } from '@modules/auth/application/commands/register/register.request.dto';

export class RegisterCommand implements ICommand {
  constructor(public readonly dto: RegisterRequestDto) {}
}
