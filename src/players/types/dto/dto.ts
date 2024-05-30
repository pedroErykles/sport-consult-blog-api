import { IsDate, IsEnum, IsNotEmpty, IsString } from '@nestjs/class-validator';
import { EFoot } from '../enums/foot';
import { IsNumber } from 'class-validator';
export class PlayerDto {
  id?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  profilePicture?: string;

  card?: string;

  @IsNotEmpty()
  @IsNumber()
  number: string;

  @IsNotEmpty()
  @IsDate()
  dateOfBirth: Date;

  @IsNotEmpty()
  @IsString()
  clubName: string;

  @IsNotEmpty()
  @IsString()
  citizenship: string;

  @IsNotEmpty()
  @IsString()
  height: string;

  @IsNotEmpty()
  @IsString()
  position: string;

  @IsNotEmpty()
  @IsString()
  weight: string;

  @IsNotEmpty()
  @IsEnum(EFoot)
  foot: string;

  statistics: Map<string, string>;

  mediaList: Map<string, string>;
}
