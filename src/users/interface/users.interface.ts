import { Document } from 'mongoose';

export interface User extends Document {
  login: string;
  email: string;
  password: string;
}

export default User;
