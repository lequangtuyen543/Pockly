import { Request, Response } from 'express';

export const getStatsByMonth = (req: Request, res: Response) => {
  res.status(200).json({ message: `Get stats for month ${req.params.month}` });
};
