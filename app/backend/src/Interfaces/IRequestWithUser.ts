import { Request } from 'express';

export default interface IRequestWithUser extends Request {
  user?: {
    email: string,
    role: string,
  };
}
