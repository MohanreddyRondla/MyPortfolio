import nodemailer from 'nodemailer';
import { env, isEmailConfigured } from './env.js';
import type { StoredMessage } from '../types/message.js';

export async function sendContactNotification(message: StoredMessage) {
  if (!isEmailConfigured()) {
    return { delivered: false, reason: 'Email settings are not configured' };
  }

  const transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass,
    },
  });

  await transporter.sendMail({
    from: env.emailFrom,
    to: env.notifyTo,
    replyTo: message.email,
    subject: `New portfolio contact: ${message.subject}`,
    text: [
      `Name: ${message.name}`,
      `Email: ${message.email}`,
      `Subject: ${message.subject}`,
      '',
      message.message,
      '',
      `Submitted at: ${message.createdAt}`,
    ].join('\n'),
    html: `
      <h2>New portfolio contact</h2>
      <p><strong>Name:</strong> ${escapeHtml(message.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(message.email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(message.subject)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message.message).replace(/\n/g, '<br/>')}</p>
      <p><strong>Submitted at:</strong> ${escapeHtml(message.createdAt)}</p>
    `,
  });

  return { delivered: true };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
