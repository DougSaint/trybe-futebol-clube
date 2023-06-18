import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthService from '../services/Auth.service';

class AuthController {
  private authService = AuthService;

  private static generateToken(email: string) {
    return jwt.sign({ email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
      algorithm: 'HS256',
    });
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
}

const authController = new AuthController();

export default authController;
