import matchesService from './Matches.service';
import IMatches from '../Interfaces/IMatches';
import teamsService from './Teams.service';
import ITeamStats from '../Interfaces/ITeamStats';
import IStatus from '../Interfaces/IStatus';

type homeOrAway = 'home' | 'away';

class LeaderBoardService {
  matchesService = matchesService;
  teamsService = teamsService;

  private static getTeamMatches(
    team: string,
    matches: IMatches[],
    filterBy: homeOrAway,
  ) {
    if (filterBy === 'home') {
      return matches.filter((match) => match?.homeTeam?.teamName === team);
    }
    return matches.filter((match) => match?.awayTeam?.teamName === team);
  }

  private static updateWinsLossesDraws(
    acc: IStatus,
    match: IMatches,
    isHomeTeam: boolean,
  ) {
    if (isHomeTeam) {
      if (match.homeTeamGoals > match.awayTeamGoals) acc.wins += 1;
      else if (match.homeTeamGoals < match.awayTeamGoals) acc.loses += 1;
      else acc.draws += 1;
    } else if (match.homeTeamGoals < match.awayTeamGoals) acc.wins += 1;
    else if (match.homeTeamGoals > match.awayTeamGoals) acc.loses += 1;
    else acc.draws += 1;
    acc.totalGames += 1;
    return { ...acc };
  }

  private static updateGoalsOwnGoalsFavor(
    acc: IStatus,
    match: IMatches,
    isHomeTeam: boolean,
  ) {
    if (isHomeTeam) {
      acc.goalsOwn += match.awayTeamGoals;
      acc.goalsFavor += match.homeTeamGoals;
    } else {
      acc.goalsOwn += match.homeTeamGoals;
      acc.goalsFavor += match.awayTeamGoals;
    }
    return acc;
  }

  static getTeamStatus(team: string, matches: IMatches[], filterBy: homeOrAway) {
    const teamMatches = LeaderBoardService.getTeamMatches(team, matches, filterBy);
    const isHomeTeam = filterBy === 'home';
    return teamMatches.reduce(
      (acc, match) => {
        let newAcc = { ...acc };
        newAcc = LeaderBoardService.updateWinsLossesDraws(
          newAcc,
          match,
          isHomeTeam,
        );
        newAcc = LeaderBoardService.updateGoalsOwnGoalsFavor(newAcc, match, isHomeTeam);
        return newAcc;
      },
      { wins: 0, loses: 0, draws: 0, totalGames: 0, goalsOwn: 0, goalsFavor: 0 },
    );
  }

  static getData(team: string, matches: IMatches[], filterBy: homeOrAway) {
    const status = LeaderBoardService.getTeamStatus(team, matches, filterBy);
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

  public static sortByTotalPoints(matches: ITeamStats[]) {
    return matches.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      if (b.goalsBalance !== a.goalsBalance) {
        return b.goalsBalance - a.goalsBalance;
      }
      return b.goalsFavor - a.goalsFavor;
    });
  }

  async home() {
    const allMatches = await this.matchesService.getMatches('false');
    const allTeams = await teamsService.getAllTeams();
    const data = allTeams.map((team) =>
      LeaderBoardService.getData(team.teamName, allMatches, 'home'));
    return LeaderBoardService.sortByTotalPoints(data);
  }

  async away() {
    const allMatches = await this.matchesService.getMatches('false');
    const allTeams = await teamsService.getAllTeams();
    const data = allTeams.map((team) =>
      LeaderBoardService.getData(team.teamName, allMatches, 'away'));
    return LeaderBoardService.sortByTotalPoints(data);
  }

  private combineStats(homeStats: ITeamStats, awayStats: ITeamStats) {
    console.log(this);
    return {
      name: homeStats.name,
      totalPoints: homeStats.totalPoints + awayStats.totalPoints,
      totalVictories: homeStats.totalVictories + awayStats.totalVictories,
      totalLosses: homeStats.totalLosses + awayStats.totalLosses,
      totalDraws: homeStats.totalDraws + awayStats.totalDraws,
      totalGames: homeStats.totalGames + awayStats.totalGames,
      goalsOwn: homeStats.goalsOwn + awayStats.goalsOwn,
      goalsFavor: homeStats.goalsFavor + awayStats.goalsFavor,
      goalsBalance: homeStats.goalsBalance + awayStats.goalsBalance,
      efficiency: ((homeStats.totalPoints + awayStats.totalPoints) / (
        (homeStats.totalGames + awayStats.totalGames) * 3)) * 100,
    };
  }

  async All() {
    const homeData = await this.home();
    const awayData = await this.away();
    const allTeams = await teamsService.getAllTeams();
    return allTeams.map((team) => {
      const homeTeamStats = homeData.find((data) => data.name === team.teamName);
      const awayTeamStats = awayData.find((data) => data.name === team.teamName);
      if (!homeTeamStats || !awayTeamStats) {
        return;
      }
      return this.combineStats(homeTeamStats, awayTeamStats);
    });
  }
}

export default new LeaderBoardService();
export { LeaderBoardService };
