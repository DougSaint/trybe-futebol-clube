import { Router } from 'express';
import matchesController from '../controllers/Matches.controller';
import authMiddleware from '../middlewares/Auth.middleware';

const matchesRouter = Router();

matchesRouter.patch('/:id/finish', authMiddleware, (req, res) =>
  matchesController.finishMatch(req, res));
matchesRouter.get('/', (req, res) => matchesController.getTeams(req, res));

export default matchesRouter;
