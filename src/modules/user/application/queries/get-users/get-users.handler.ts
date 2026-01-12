import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from './get-users.query';
import { UserResponseDto } from '../../dtos/user.response.dto';
import { UserReadModel } from '@modules/user/infrastructure/persistence/read-models/user.read-model.service';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly readModel: UserReadModel) {}

  async execute(query: GetUsersQuery): Promise<UserResponseDto[]> {
    return this.readModel.findAll(query.page, query.limit);
  }
}
