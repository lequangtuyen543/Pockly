import { Router } from 'express';
import { getBudgetByMonth, updateBudgetByMonth } from '../controllers/budget.controller';

const router = Router();

router.route('/:month')
  .get(getBudgetByMonth)
  .put(updateBudgetByMonth);

export default router;
