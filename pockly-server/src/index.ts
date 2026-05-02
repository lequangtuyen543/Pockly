import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import transactionRoutes from './routes/transaction.routes';
import categoryRoutes from './routes/category.routes';
import budgetRoutes from './routes/budget.routes';
import statsRoutes from './routes/stats.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Pockly server is running' });
});

// API Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/stats', statsRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
