import { Request, Response, NextFunction } from 'express';
import matchesService from '../services/Matches.service';

const validateRequest = (req: Request, res: Response): boolean => {
  const { homeTeamId, homeTeamGoals, awayTeamId, awayTeamGoals } = req.body;

  if (!homeTeamId || !homeTeamGoals || !awayTeamId || !awayTeamGoals) {
    res.status(400).json({ message: 'All fields must be filled' });
    return false;
  }
  if (homeTeamId === awayTeamId) {
    res.status(422).json({
      message: 'It is not possible to create a match with two equal teams',
    });
    return false;
  }
  return true;
};

const validateTeams = async (req: Request, res: Response): Promise<boolean> => {
  const { homeTeamId, awayTeamId } = req.body;

  const homeTeam = await matchesService.getTeamByPk(+homeTeamId);
  const awayTeam = await matchesService.getTeamByPk(+awayTeamId);

  if (!homeTeam || !awayTeam) {
    res.status(404).json({ message: 'There is no team with such id!' });
    return false;
  }
  return true;
};

const MatchValidate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  if (!validateRequest(req, res)) {
    return;
  }
  if (!(await validateTeams(req, res))) {
    return;
  }
  next();
};

export default MatchValidate;
