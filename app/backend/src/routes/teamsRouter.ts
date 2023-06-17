import { Router } from 'express';
import teamsController from '../controllers/Teams.controller';

const teamsRouter = Router();

teamsRouter.get('/', (req, res) => teamsController.getTeams(req, res));
teamsRouter.get('/:id', (req, res) => teamsController.getTeamById(req, res));

export default teamsRouter;
