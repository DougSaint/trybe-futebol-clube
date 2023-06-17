import TeamsModel from '../database/models/SequelizeTeam';

class TeamsService {
  private teamsModel = TeamsModel;

  async getAllTeams() {
    return this.teamsModel.findAll();
  }

  async getTeamById(id: number) {
    return this.teamsModel.findByPk(id);
  }
}

const teamsService = new TeamsService();

export default teamsService;
