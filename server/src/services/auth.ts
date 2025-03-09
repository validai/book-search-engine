
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AuthenticationError } from 'apollo-server-express';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const secret = process.env.JWT_SECRET_KEY || '';
const expiration = '1h';

export interface JwtPayload {
  _id: string;
  username: string;
  email: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || '';
  let token = '';

  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Forbidden' });
  }
};

export const signToken = (username: string, email: string, _id: string) => {
  const payload = { username, email, _id };
  return jwt.sign(payload, secret, { expiresIn: expiration });
};

export const authMiddleware = ({ req }: { req: any }) => {
  const authHeader = req.headers.authorization || '';
  let token = '';

  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return req;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return { user: decoded };
  } catch (err) {
    throw new AuthenticationError('Invalid token');
  }
};
