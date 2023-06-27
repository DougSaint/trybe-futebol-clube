import { Request, Response } from 'express';
import MatchesService from '../services/Matches.service';

class MatchesController {
  private matchesService = MatchesService;

  public async getMatches(req: Request, res: Response): Promise<Response> {
    const data = await this.matchesService.getMatches(
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

  public async updateMatch(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const { homeTeamGoals, awayTeamGoals } = req.body;

    const data = await this.matchesService.updateMatch(
      +id,
      +homeTeamGoals,
      +awayTeamGoals,
    );
    if (!data) {
      return res.status(200).json({ message: 'not exists' });
    }
    return res.status(200).json(data);
  }

  public async createMatch(req: Request, res: Response): Promise<Response> {
    const match = req.body;
    const data = await this.matchesService.createMatch(match);
    return res.status(201).json(data);
  }
}

const matchesController = new MatchesController();

export default matchesController;
