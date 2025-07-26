import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth } from '@nestjs/swagger';
import { BasePaginationDto } from 'src/common/shared/base-classes/base.pagination';
import { GetUserListQuery } from '../query/user-list/user-list.query';

@Controller('v1/user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('list')
  async getUserList(@Query() query: BasePaginationDto) {
    return this.queryBus.execute(new GetUserListQuery(query));
  }
}
