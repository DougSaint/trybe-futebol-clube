import { Request, Response } from 'express';
import leaderboardService, { LeaderBoardService } from '../services/Leaderboard.service';
import ITeamStats from '../Interfaces/ITeamStats';

class LeaderboardController {
  leaderboardService = leaderboardService;

  async home(req: Request, res: Response): Promise<Response> {
    const matches = await this.leaderboardService.home();
    return res.status(200).json(matches);
  }

  async away(req: Request, res: Response): Promise<Response> {
    const matches = await this.leaderboardService.away();
    return res.status(200).json(matches);
  }

  async getAll(req: Request, res: Response) {
    const matches = await this.leaderboardService.All();
    const validMatches = matches.filter(Boolean) as unknown as ITeamStats[];
    const sort = LeaderBoardService.sortByTotalPoints(validMatches);
    return res.status(200).json(sort);
  }
}

export default new LeaderboardController();
