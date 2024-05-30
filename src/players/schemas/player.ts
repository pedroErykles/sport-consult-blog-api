import { Schema } from 'mongoose';
import { EFoot } from '../types/enums/foot';

const playerSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    profilePictureUrl: {
      type: Schema.Types.String,
    },
    card: {
      type: Schema.Types.String,
    },
    number: {
      type: Schema.Types.Number,
    },
    dateOfBirth: {
      type: Schema.Types.Date,
      required: true,
    },
    clubName: {
      type: Schema.Types.String,
    },
    citizenship: {
      type: Schema.Types.String,
    },
    height: {
      type: Schema.Types.String,
    },
    position: {
      type: Schema.Types.String,
    },
    weight: {
      type: Schema.Types.String,
    },
    foot: {
      type: Schema.Types.String,
      enum: EFoot,
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

/*playerSchema.pre('save', function (next) {
  console.log('middleware is invoked');
  if (!footValues.includes(this.foot)) {
    throw new HttpException(
      `${this.foot} is not a valid foot type`,
      HttpStatus.BAD_REQUEST,
    );
  }

  next();
});
*/

export default playerSchema;
