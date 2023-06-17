import { Router } from 'express';
import teamsRouter from './teamsRouter';

const router = Router();

router.use('/teams', teamsRouter);

export default router;
