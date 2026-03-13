import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { contactRouter } from './routes/contact.js';
import { portfolioRouter } from './routes/portfolio.js';
import { readMessages } from './utils/storage.js';
const app = express();
const port = Number(process.env.PORT || 4000);
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: frontendOrigin }));
app.use(express.json());
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api/portfolio', portfolioRouter);
app.use('/api/contact', contactRouter);
app.get('/api/messages', (_req, res) => {
    res.json(readMessages());
});
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ message: 'Unexpected server error' });
});
app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});
