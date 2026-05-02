import { Router } from 'express';
import { getStatsByMonth } from '../controllers/stats.controller';

const router = Router();

router.route('/:month')
  .get(getStatsByMonth);

export default router;
