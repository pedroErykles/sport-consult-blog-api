import { Injectable } from '@nestjs/common';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userDto: UserDto) {}

  validateUser(login: string, password: string) {
    throw new Error('Method not implemented.');
  }
}
