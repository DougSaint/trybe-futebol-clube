import { Request, Response } from 'express';
import TeamService from '../services/Teams.service';

class TeamsController {
  private teamsService = TeamService;

  public async getTeams(_req: Request, res: Response): Promise<Response> {
    const data = await this.teamsService.getAllTeams();
    return res.status(200).json(data);
  }

  public async getTeamById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const data = await this.teamsService.getTeamById(+id);
    return res.status(200).json(data);
  }
}

const teamsController = new TeamsController();

export default teamsController;
