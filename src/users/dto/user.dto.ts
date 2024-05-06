import { IsEmail, IsNotEmpty } from 'class-validator';
import { fileDTO } from 'src/upload/upload.dto';

export class UserDto {
  @IsNotEmpty()
  readonly login: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
