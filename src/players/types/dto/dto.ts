import { IsNotEmpty, IsString } from 'class-validator';
export class PlayerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  personalInfo: Map<string, any>;

  statistics: Map<string, string>;

  mediaList: Map<string, string>;
}
