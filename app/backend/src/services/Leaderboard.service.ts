import matchesService from './Matches.service';
import IMatches from '../Interfaces/IMatches';
import teamsService from './Teams.service';

class MatchesService {
  matchesService = matchesService;
  teamsService = teamsService;

  private getTeamMatches(team: string, matches: IMatches[]) {
    console.log(this);
    return matches.filter((match) => match?.homeTeam?.teamName === team);
  }

  getHomeTeamStatus(team: string, matches: IMatches[]) {
    const teamMatches = this.getTeamMatches(team, matches);
    return teamMatches.reduce(
      (acc, match) => {
        if (match.homeTeamGoals > match.awayTeamGoals) acc.wins += 1;
        else if (match.homeTeamGoals < match.awayTeamGoals) acc.loses += 1;
        else acc.draws += 1;
        acc.goalsOwn += match.awayTeamGoals;
        acc.goalsFavor += match.homeTeamGoals;
        acc.totalGames += 1;
        return acc;
      },
      { wins: 0, loses: 0, draws: 0, totalGames: 0, goalsOwn: 0, goalsFavor: 0 },
    );
  }

  getData(team: string, matches: IMatches[]) {
    const status = this.getHomeTeamStatus(team, matches);
    const totalPoints = status.wins * 3 + status.draws;
    return {
      name: team,
      totalPoints,
      totalVictories: status.wins,
      totalLosses: status.loses,
      totalDraws: status.draws,
      totalGames: status.totalGames,
      goalsOwn: status.goalsOwn,
      goalsFavor: status.goalsFavor,
      goalsBalance: status.goalsFavor - status.goalsOwn,
      efficiency: ((totalPoints / (status.totalGames * 3)) * 100).toFixed(2),
    };
  }

  async home() {
    const allMatches = await this.matchesService.getMatches('false');
    const allTeams = await teamsService.getAllTeams();
    const data = allTeams.map((team) =>
      this.getData(team.teamName, allMatches));
    return data.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      if (b.goalsBalance !== a.goalsBalance) {
        return b.goalsBalance - a.goalsBalance;
      }
      return b.goalsFavor - a.goalsFavor;
    });
  }
}

export default new MatchesService();
