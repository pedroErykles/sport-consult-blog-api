import { Schema } from 'mongoose';

export const playerSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    personalInfo: {
      type: Schema.Types.Map,
      of: Schema.Types.Mixed,
    },
    statistics: {
      type: Schema.Types.Map,
      of: Schema.Types.String,
    },
    mediaList: {
      type: Schema.Types.Map,
      of: Schema.Types.String,
    },
    deletedAt: {
      type: Schema.Types.Date,
      default: null,
    },
  },
  { timestamps: true },
);
