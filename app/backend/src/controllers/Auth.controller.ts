import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthService from '../services/Auth.service';
import RequestWithUser from '../Interfaces/IRequestWithUser';

class AuthController {
  private authService = AuthService;

  private static secret = process.env.JWT_SECRET || 'secret';

  public static generateToken(email: string) {
    return jwt.sign({ email }, AuthController.secret, {
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

  public async getRole(req: RequestWithUser, res: Response): Promise<Response> {
    console.log(this);
    const { user } = req;
    if (user) {
      return res.status(200).json({ role: user?.role });
    }
    return res.status(401).json({ message: 'Token must be a valid token' });
  }
}

const authController = new AuthController();

export default authController;
export { AuthController };
