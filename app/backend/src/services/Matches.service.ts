import TeamsModel from '../database/models/SequelizeTeam';
import MatchesModel from '../database/models/SequelizeMatches';
import IMatches from '../Interfaces/IMatches';

class MatchesService {
  private matchesModel = MatchesModel;
  private teamsModel = TeamsModel;

  private static filterMatches(matches: IMatches[], query: string) {
    if (query === 'true') return matches.filter((match) => match.inProgress);
    if (query === 'false') return matches.filter((match) => !match.inProgress);
    return matches;
  }

  async getAllTeams(query: string) {
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

  async finishMatch(id: number) {
    console.log(id);
    const match = await this.matchesModel.findByPk(id);
    console.log(match);
    if (!match) {
      return false;
    }
    match.inProgress = false;
    match.save();
    return true;
  }
}

const matchesService = new MatchesService();

export default matchesService;
