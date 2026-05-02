import { Request, Response } from 'express';

export const getBudgetByMonth = (req: Request, res: Response) => {
  res.status(200).json({ message: `Get budget for month ${req.params.month}` });
};

export const updateBudgetByMonth = (req: Request, res: Response) => {
  res.status(200).json({ message: `Update budget for month ${req.params.month}` });
};
