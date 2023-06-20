import { Request, Response } from 'express';
import MatchesService from '../services/Matches.service';

class MatchesController {
  private matchesService = MatchesService;

  public async getTeams(req: Request, res: Response): Promise<Response> {
    const data = await this.matchesService.getAllTeams(
      req.query.inProgress as string,
    );

    return res.status(200).json(data);
  }

  public async finishMatch(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const data = await this.matchesService.finishMatch(+id);
    if (!data) {
      return res.status(200).json({ message: 'not exists' });
    }
    return res.status(200).json({ message: 'Finished' });
  }
}

const matchesController = new MatchesController();

export default matchesController;
