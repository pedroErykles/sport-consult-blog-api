import { Document } from 'mongoose';

export interface Player extends Document {
  name: string;
  personalInfo: Map<string, any>;
  statistics: Map<string, string>;
  deletedAt: Date;
}
