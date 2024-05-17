import { Document } from 'mongoose';
import { EFoot } from '../enums/foot';

export interface Player extends Document {
  name: string;

  dateOfBirth: Date;

  clubName: string;

  citizenship: string;

  height: string;

  position: string;

  weight: string;

  foot: EFoot;

  statistics: Map<string, string>;

  //Key: the tag, Value: the url
  mediaList: Map<string, string>;

  deletedAt: Date;
}
