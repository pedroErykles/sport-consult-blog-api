import { Document } from 'mongoose';

export interface Player extends Document {
  name: string;
  personalInfo: Map<string, any>;
  statistics: Map<string, string>;
  //Key: the tag, Value: the url
  mediaList: Map<string, string>;
  deletedAt: Date;
}
