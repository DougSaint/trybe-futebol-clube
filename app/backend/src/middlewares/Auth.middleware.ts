import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthService from '../services/Auth.service';
import IRequestWithUser from '../Interfaces/IRequestWithUser';

const validateToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'secret');
  } catch (err) {
    return false;
  }
};

export default async function AuthMiddleware(
  req: IRequestWithUser,
  res: Response,
  next: NextFunction,
) {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: 'Token not found' });
  const authService = AuthService;
  const payload = validateToken(authorization);
  if (typeof payload !== 'object') {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
  const user = await authService.findByEmail(payload.email);
  if (!user) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
  req.user = user;
  next();
}
