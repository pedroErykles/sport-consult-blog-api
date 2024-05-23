import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../interface/users.interface';
import { UserDto } from '../dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileDTO } from 'src/shared/upload/upload.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Get('/query')
  async getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get('/query/:id')
  async getById(@Param('id') id: string): Promise<User> {
    return this.userService.getById(id);
  }

  @IsPublic()
  @Post('/register')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() user: UserDto,
    @Body('confirmPassword') confirmPassword: string,
    @UploadedFile() image: fileDTO,
  ) {
    return this.userService.create(user, confirmPassword, image);
  }

  @Put('/update/:id')
  async update(@Param('id') id: string, @Body() user: UserDto) {
    return this.userService.update(id, user);
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
