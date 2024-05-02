import { IsEmail, IsString } from 'class-validator';

export class LoginRequestBody {
  @IsString()
  login: string;

  @IsString()
  password: string;
}
