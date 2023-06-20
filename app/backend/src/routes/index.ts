import { Router } from 'express';
import teamsRouter from './teamsRouter';
import validateEmailAndPassword from '../middlewares/validateUser.middleware';
import authController from '../controllers/Auth.controller';
import matchesRouter from './matches.router';
import AuthMiddleware from '../middlewares/Auth.middleware';

const router = Router();

router.use('/teams', teamsRouter);
router.use('/matches', matchesRouter);

router.post('/login', validateEmailAndPassword, (req, res) =>
  authController.login(req, res));
router.get('/login/role', AuthMiddleware, (req, res) =>
  authController.getRole(req, res));

export default router;
