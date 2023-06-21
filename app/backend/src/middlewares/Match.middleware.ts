import { Request, Response, NextFunction } from 'express';

const MatchValidate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals } = req.body;
  console.log(homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals);
  if (!homeTeamId || !homeTeamGoals || !awayTeamId || !awayTeamGoals) {
    res.status(400).json({ message: 'All fields must be filled' });
    return;
  }

  next();
};

export default MatchValidate;
