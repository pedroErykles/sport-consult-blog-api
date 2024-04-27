import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../interface/users.interface';
import { UserDto } from '../dto/user.dto';

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

  @Post('/register')
  async create(
    @Body() user: UserDto,
    @Body('confirmPassword') confirmPassword: string,
  ) {
    return this.userService.create(user, confirmPassword);
  }

  @Put('/update/:id')
  async update(@Param('id') id: string, @Body() user: UserDto): Promise<User> {
    return this.userService.update(id, user);
  }

  @Delete('/delete/:id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
