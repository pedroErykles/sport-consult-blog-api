import { Document, ObjectId } from 'mongoose';

export interface Blog extends Document {
  title: string;
  subtitle: string;
  body: string;
  thumbPictureUrl: string;
  location: string;
  relatedPlayers: ObjectId[];
  views: number;
  deletedAt: Date;
}
