import { UploadPostImages } from '@/common/shared/decorator/upload-post-images.decorator';
import { AuthGuard } from '@/common/shared/guards/login-auth.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CommandBus } from '@nestjs/cqrs/dist/command-bus';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePostCommand } from '../command/create/create-post.command';
import { CreatePostDto } from '../dto/create-post.dto';
import { GetMyPostsQuery } from '../query/my-posts/my-posts.query';
import { GetSinglePostQuery } from '../query/single-post/single-post.query';

@ApiTags('Post')
@Controller('v1/post')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class PostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('create')
  @UploadPostImages()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ): Promise<any> {
    return await this.commandBus.execute(
      new CreatePostCommand(createPostDto, files, req.user?.id),
    );
  }

  @Get(':id')
  async getSinglePost(@Param('id') id: string): Promise<any> {
    return await this.queryBus.execute(new GetSinglePostQuery(id));
  }

  @Get('my-posts')
  async getMyPosts(@Req() req: any): Promise<any> {
    return await this.queryBus.execute(new GetMyPostsQuery(req.user?.id));
  }
}
