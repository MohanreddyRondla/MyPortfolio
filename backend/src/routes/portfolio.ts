import { Router } from 'express';
import { portfolioData } from '../data/portfolio.js';

export const portfolioRouter = Router();

portfolioRouter.get('/', (_req, res) => {
  res.json(portfolioData);
});
