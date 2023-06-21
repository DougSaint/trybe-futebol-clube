import { Router } from 'express';
import matchesController from '../controllers/Matches.controller';
import authMiddleware from '../middlewares/Auth.middleware';
import MatchValidate from '../middlewares/Match.middleware';

const matchesRouter = Router();

matchesRouter.patch('/:id/finish', authMiddleware, (req, res) =>
  matchesController.finishMatch(req, res));
matchesRouter.patch('/:id', authMiddleware, (req, res) =>
  matchesController.updateMatch(req, res));
matchesRouter.get('/', (req, res) => matchesController.getTeams(req, res));
matchesRouter.post('/', authMiddleware, MatchValidate, (req, res) =>
  matchesController.createMatch(req, res));

export default matchesRouter;
