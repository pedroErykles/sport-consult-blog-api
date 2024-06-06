import { Schema } from 'mongoose';

const blogsSchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      required: true,
    },
    subtitle: {
      type: Schema.Types.String,
      required: true,
    },
    body: {
      type: Schema.Types.String,
      required: true,
    },
    thumbPictureUrl: {
      type: Schema.Types.String,
      required: true,
    },
    location: {
      type: Schema.Types.String,
      required: true,
    },
    relatedPlayers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
    views: [
      {
        viewID: {
          type: Schema.Types.String,
          required: true,
        },
        _id: false,
      },
    ],
    deletedAt: {
      type: Schema.Types.Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default blogsSchema;
