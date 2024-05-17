import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { EFoot } from '../enums/foot';
export class PlayerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

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

export class PaginationOptions {
  @IsNumber()
  @Min(1)
  limit: number;

  @IsNumber()
  @Min(1)
  page: number;
}
