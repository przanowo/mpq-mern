import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import asyncHandler from './asyncHandler';
import User from '../models/userModel';
import { IUserDocument, RequestWithUser } from '../types/userType';

// Protect routes
export const protect = asyncHandler(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    let token: string | undefined;
    //Read JWT from cookie
    token = req.cookies.jwt;

    // Make sure token exists
    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET!
        ) as jwt.JwtPayload;
        req.user = (await User.findById(decoded.userId).select(
          '-password'
        )) as IUserDocument;
        next();
      } catch (error) {
        console.log(error);
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    } else {
      res.status(401);
      throw new Error('Not authorized, no token');
    }
  }
);

//Admin middleware
export const admin = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin.');
  }
};
