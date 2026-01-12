import { GetUserAuthInfoRequestDto } from '@modules/user/application/queries/get-user-auth-info/get-user-auth-info.request.dto';
import { IQuery } from '@nestjs/cqrs';

export class GetUserAuthInfoQuery implements IQuery {
  constructor(public readonly dto: GetUserAuthInfoRequestDto) {}
}
