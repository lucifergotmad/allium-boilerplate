import { UpdateUserRequestDto } from '@modules/user/application/commands/update-user/update-user.request.dto';
import { ICommand } from '@nestjs/cqrs';

export class UpdateUserCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly dto: UpdateUserRequestDto
  ) {}
}
