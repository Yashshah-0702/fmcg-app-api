import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
  _id: string;
  user_type:number;
  email:string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
  file:any;
  media_details:any;
}
