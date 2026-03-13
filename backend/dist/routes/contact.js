import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { saveMessage } from '../utils/storage.js';
const contactSchema = z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
    email: z.string().trim().email('Please enter a valid email address'),
    subject: z.string().trim().min(3, 'Subject must be at least 3 characters').max(120),
    message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000),
});
export const contactRouter = Router();
contactRouter.post('/', (req, res) => {
    const result = contactSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            message: result.error.issues[0]?.message ?? 'Invalid form payload',
        });
    }
    saveMessage({
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        ...result.data,
    });
    return res.status(201).json({
        message: 'Thanks for reaching out. Your message has been saved successfully.',
    });
});
