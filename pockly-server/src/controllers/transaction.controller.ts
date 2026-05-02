import { Request, Response } from 'express';

export const getTransactions = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Get transactions endpoint' });
};

export const createTransaction = (req: Request, res: Response) => {
  res.status(201).json({ message: 'Create transaction endpoint' });
};

export const updateTransaction = (req: Request, res: Response) => {
  res.status(200).json({ message: `Update transaction ${req.params.id}` });
};

export const deleteTransaction = (req: Request, res: Response) => {
  res.status(200).json({ message: `Delete transaction ${req.params.id}` });
};
