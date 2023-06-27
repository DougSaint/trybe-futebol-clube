import { Request, Response } from 'express';
import LeaderboardService from '../services/Leaderboard.service';

class LeaderboardController {
  leaderboardService = LeaderboardService;

  async home(req: Request, res: Response): Promise<Response> {
    const matches = await this.leaderboardService.home();
    return res.status(200).json(matches);
  }

  async away(req: Request, res: Response): Promise<Response> {
    const matches = await this.leaderboardService.away();
    return res.status(200).json(matches);
  }
}

export default new LeaderboardController();
