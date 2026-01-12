import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserInternalDto } from '@modules/user/api/dtos/user.internal.dto';
import { GetUserAuthInfoQuery } from '@modules/user/application/queries/get-user-auth-info/get-user-auth.info.query';
import { UserReadModel } from '@modules/user/infrastructure/persistence/read-models/user.read-model.service';

@QueryHandler(GetUserAuthInfoQuery)
export class GetUserAuthInfoHandler implements IQueryHandler<GetUserAuthInfoQuery> {
  constructor(private readonly readModel: UserReadModel) {}

  async execute(query: GetUserAuthInfoQuery): Promise<UserInternalDto | null> {
    const { email } = query.dto;

    return await this.readModel.findInternalByEmail(email);
  }
}
