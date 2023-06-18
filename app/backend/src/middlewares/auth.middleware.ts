import { Request, Response, NextFunction } from 'express';

const validateEmailAndPassword = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { email, password } = req.body;
  const validEmail = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
  if (!email || !password) {
    res.status(400).json({ message: 'All fields must be filled' });
    return;
  }

  if (!validEmail.test(email) || password.length < 6) {
    res.status(400).json({ message: 'Invalid email or password' });
    return;
  }
  next();
};

export default validateEmailAndPassword;
