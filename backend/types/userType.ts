import { Request } from 'express';
import { Document } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// In your userType.ts
export interface IUserDocument extends IUser, Document {}

// Extending the Express Request type
export interface RequestWithUser extends Request {
  user?: IUserDocument;
}
