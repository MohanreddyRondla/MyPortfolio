import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { adminRouter } from './routes/admin.js';
import { contactRouter } from './routes/contact.js';
import { portfolioRouter } from './routes/portfolio.js';
import { env, isAdminConfigured, isDatabaseConfigured, isEmailConfigured } from './lib/env.js';
import { initializeMessageStore, readMessages } from './utils/storage.js';

const app = express();

app.use(cors({ origin: env.frontendOrigin }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    storage: isDatabaseConfigured() ? 'postgresql' : 'json-file',
    emailNotifications: isEmailConfigured(),
    adminDashboard: isAdminConfigured(),
  });
});

app.use('/api/portfolio', portfolioRouter);
app.use('/api/contact', contactRouter);
app.use('/api/admin', adminRouter);

app.get('/api/messages', async (_req, res, next) => {
  try {
    res.json(await readMessages());
  } catch (error) {
    next(error);
  }
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: err instanceof Error ? err.message : 'Unexpected server error' });
});

initializeMessageStore()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Backend server running on http://localhost:${env.port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize backend', error);
    process.exit(1);
  });
