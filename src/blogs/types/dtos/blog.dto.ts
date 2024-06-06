import { IsNotEmpty } from 'class-validator';

export class BlogDTO {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  subtitle: string;
  @IsNotEmpty()
  body: string;
  @IsNotEmpty()
  thumbPictureUrl: string;
  @IsNotEmpty()
  location: string;
  relatedPlayers: string[];
}
