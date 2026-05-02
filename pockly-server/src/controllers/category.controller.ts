import { Request, Response } from 'express';

export const getCategories = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Get categories endpoint' });
};

export const createCategory = (req: Request, res: Response) => {
  res.status(201).json({ message: 'Create category endpoint' });
};
