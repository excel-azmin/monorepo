import { PrismaService } from '@/common/shared/prisma/prisma.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { UserService } from '../../service/user.service';
import { UpdateUserProfileImageCommand } from './update-user-profile-image.command';

@CommandHandler(UpdateUserProfileImageCommand)
export class UpdateUserProfileImageHandler
  implements ICommandHandler<UpdateUserProfileImageCommand>
{
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async execute(command: UpdateUserProfileImageCommand) {
    const { file, userId } = command;
    if (!file) {
      throw new Error('File is required for profile image update');
    }
    // Delete the old image
    const oldImage = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });
    if (oldImage && oldImage.image) {
      try {
        await this.deleteImageFile(oldImage.image);
      } catch (error) {
        console.error('Failed to delete old image:', error);
      }
    }
    const user = await this.prismaService.user.update({
      where: { id: userId },
      data: {
        image: file.path,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return this.userService.sanitizeUser(user);
  }
  private async deleteImageFile(imagePath: string): Promise<void> {
    try {
      const fullPath = join(process.cwd(), imagePath);
      await unlink(fullPath);
      console.log('Successfully deleted old image:', imagePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('Failed to delete old image:', error);
      }
    }
  }
}
