import { IsEmail, IsNotEmpty } from 'class-validator';
import { fileDTO } from 'src/shared/upload/upload.dto';

export class UserDto {
  @IsNotEmpty()
  readonly login: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
