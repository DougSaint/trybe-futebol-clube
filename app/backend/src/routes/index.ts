import { Router } from 'express';
import teamsRouter from './teamsRouter';
import validateEmailAndPassword from '../middlewares/auth.middleware';
import authController from '../controllers/Auth.controller';

const router = Router();

router.use('/teams', teamsRouter);
router.post('/login', validateEmailAndPassword, (req, res) =>
  authController.login(req, res));
router.get('/login/role', (req, res) =>
  authController.getRole(req, res));

export default router;
