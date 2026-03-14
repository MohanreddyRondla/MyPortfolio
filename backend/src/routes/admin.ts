import { Router } from 'express';
import { env, isAdminConfigured, isDatabaseConfigured, isEmailConfigured } from '../lib/env.js';
import { readMessages } from '../utils/storage.js';

export const adminRouter = Router();

function resolveAdminKey(req: import('express').Request) {
  return req.header('x-admin-key') || String(req.query.adminKey || '');
}

adminRouter.use((req, res, next) => {
  if (!isAdminConfigured()) {
    return res.status(503).json({ message: 'Admin dashboard is disabled. Set ADMIN_DASHBOARD_KEY in your backend environment.' });
  }

  const key = resolveAdminKey(req);
  if (!key || key !== env.ADMIN_DASHBOARD_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
});

adminRouter.get('/messages', async (_req, res, next) => {
  try {
    const messages = await readMessages();
    return res.json({
      messages,
      meta: {
        total: messages.length,
        storage: isDatabaseConfigured() ? 'postgresql' : 'json-file',
        emailNotifications: isEmailConfigured(),
      },
    });
  } catch (error) {
    next(error);
  }
});

adminRouter.get('/messages/export', async (req, res, next) => {
  try {
    const format = String(req.query.format || 'json').toLowerCase();
    const messages = await readMessages();

    if (format === 'csv') {
      const header = ['id', 'createdAt', 'name', 'email', 'subject', 'message'];
      const rows = messages.map((message) => [
        message.id,
        message.createdAt,
        message.name,
        message.email,
        message.subject,
        message.message,
      ]);

      const csv = [header, ...rows]
        .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
        .join('\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="contact-messages.csv"');
      return res.send(csv);
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="contact-messages.json"');
    return res.send(JSON.stringify(messages, null, 2));
  } catch (error) {
    next(error);
  }
});
