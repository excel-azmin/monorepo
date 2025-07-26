import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserService } from 'src/modules/user/service/user.service';
import { GetMeQuery } from './get-me.query';

@QueryHandler(GetMeQuery)
export class GetMeHandler implements IQueryHandler<GetMeQuery> {
  constructor(private readonly userService: UserService) {}

  async execute(query: GetMeQuery): Promise<any> {
    const { userId } = query;
    return await this.userService.getUserById(userId);
  }
}
