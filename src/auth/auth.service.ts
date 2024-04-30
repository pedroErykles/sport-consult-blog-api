import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/users/services/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(login: string, password: string) {
    const user = await this.userService.findByLogin(login);

    if (user) {
      const passwordIsValid = await bcrypt.compare(password, user.password);

      if (passwordIsValid) {
        return {
          ...user,
          password: undefined,
        };
      }
    }

    throw new Error('Login or password provided is incorrect');
  }
}
