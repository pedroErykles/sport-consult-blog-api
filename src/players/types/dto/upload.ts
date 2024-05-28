import { IsNotEmpty } from '@nestjs/class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  originalname: string;
  @IsNotEmpty()
  buffer: Buffer;
}
