import mongoose, { model } from 'mongoose';

export const userSchema = new mongoose.Schema({
  login: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  image: {
    type: String,
  },
});

export default userSchema;
