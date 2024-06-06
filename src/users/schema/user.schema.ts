import mongoose, { Schema, model } from 'mongoose';

export const userSchema = new mongoose.Schema({
  login: {
    type: Schema.Types.String,
    unique: true,
  },
  email: {
    type: Schema.Types.String,
    unique: true,
  },
  password: {
    type: Schema.Types.String,
  },
  image: {
    type: Schema.Types.String,
  },
});

export default userSchema;
