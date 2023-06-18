import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthService from '../services/Auth.service';

class AuthController {
  private authService = AuthService;

  private static secret = process.env.JWT_SECRET || 'secret';

  private static generateToken(email: string) {
    return jwt.sign({ email }, AuthController.secret, {
      expiresIn: '1h',
      algorithm: 'HS256',
    });
  }

  private static validateToken(token: string) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch (err) {
      return false;
    }
  }

  public async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const validateUser = await this.authService.login(email, password);

    if (validateUser) {
      return res
        .status(200)
        .json({ token: AuthController.generateToken(req.body.email) });
    }
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  public async getRole(req: Request, res: Response): Promise<Response> {
    const { authorization } = req.headers;

    if (!authorization) return res.status(401).json({ message: 'Token not found' });

    const payload = AuthController.validateToken(authorization);

    if (typeof payload !== 'object') {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }

    const user = await this.authService.findByEmail(payload.email);

    if (user) {
      return res.status(200).json({ role: user?.role });
    }
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
}

const authController = new AuthController();

export default authController;
