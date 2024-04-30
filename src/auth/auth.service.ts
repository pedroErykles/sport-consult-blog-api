import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import User from 'src/users/interface/users.interface';
import { UserService } from 'src/users/services/user.service';
import { UserPayload } from './interfaces/UserPayload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './interfaces/UserToken.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  login(user: User): UserToken {
    const payload: UserPayload = {
      sub: user._id,
      login: user.login,
      email: user.email,
    };

    const jwtToken = this.jwtService.sign(payload);

    return {
      access_token: jwtToken,
    };
  }

  async validateUser(login: string, password: string) {
    const user = await this.userService.findByLogin(login);

    if (user) {
      const passwordIsValid = await bcrypt.compare(password, user.password);

      if (passwordIsValid) {
        return user;
      }
    }

    throw new Error('Login or password provided is incorrect');
  }
}
