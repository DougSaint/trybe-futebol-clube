import { Router } from 'express';
import LeaderboardController from '../controllers/Leaderboard.controller';
// import teamsController from '../controllers/Teams.controller';

const leaderboardRouter = Router();

leaderboardRouter.get('/home', (req, res) => LeaderboardController.home(req, res));

export default leaderboardRouter;
