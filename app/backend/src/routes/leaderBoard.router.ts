import { Router } from 'express';
import LeaderboardController from '../controllers/Leaderboard.controller';
// import teamsController from '../controllers/Teams.controller';

const leaderboardRouter = Router();

leaderboardRouter.get('/home', (req, res) => LeaderboardController.home(req, res));
leaderboardRouter.get('/away', (req, res) => LeaderboardController.away(req, res));

export default leaderboardRouter;
