export default interface IMatches {
  id: number;
  homeTeamId: number;
  homeTeamGoals: number;
  awayTeamId: number;
  awayTeamGoals: number;
  inProgress: boolean;
  awayTeam?: { teamName: string };
  homeTeam?: { teamName: string };
}
