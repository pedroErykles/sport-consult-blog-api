import { Request } from 'express';
import User from 'src/users/interface/users.interface';

export interface AuthRequest extends Request {
  user: User;
}
