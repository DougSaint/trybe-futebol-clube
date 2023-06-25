import TeamsModel from '../database/models/SequelizeTeam';
import MatchesModel from '../database/models/SequelizeMatches';
import IMatches from '../Interfaces/IMatches';

class MatchesService {
  private matchesModel = MatchesModel;
  private teamsModel = TeamsModel;

  private static filterMatches(matches: IMatches[], query?: string) {
    if (query === 'true') return matches.filter((match) => match.inProgress);
    if (query === 'false') return matches.filter((match) => !match.inProgress);
    return matches;
  }

  async getMatches(query?: string) {
    const data = await this.matchesModel.findAll({
      include: [
        {
          model: this.teamsModel,
          as: 'homeTeam',
          foreignKey: 'homeTeamId',
          attributes: ['teamName'],
        },
        {
          model: this.teamsModel,
          as: 'awayTeam',
          foreignKey: 'awayTeamId',
          attributes: ['teamName'],
        },
      ],
    });

    return MatchesService.filterMatches(data, query);
  }

  public async finishMatch(id: number) {
    const match = await this.matchesModel.findByPk(id);
    if (!match) {
      return false;
    }
    match.inProgress = false;
    await match.save();
    return true;
  }

  public async updateMatch(id: number, homeGoals: number, awayGoals: number) {
    const match = await this.matchesModel.findByPk(id);

    if (!match) {
      return false;
    }
    if (homeGoals) match.homeTeamGoals = homeGoals;
    if (awayGoals) match.awayTeamGoals = awayGoals;
    return match.save();
  }

  public async createMatch(match: IMatches): Promise<IMatches> {
    console.log(match);
    return this.matchesModel.create({ ...match, inProgress: true });
  }

  public async getTeamByPk(id: number) {
    return this.matchesModel.findByPk(id);
  }
}

const matchesService = new MatchesService();

export default matchesService;
