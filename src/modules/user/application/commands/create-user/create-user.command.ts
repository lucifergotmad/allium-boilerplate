import { ICommand } from '@nestjs/cqrs';
import { CreateUserRequestDto } from '@modules/user/application/commands/create-user/create-user.request.dto';

export class CreateUserCommand implements ICommand {
  constructor(public readonly dto: CreateUserRequestDto) {}
}
