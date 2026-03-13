function parseBoolean(value: string | undefined, fallback = false) {
  if (value == null) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

export const env = {
  port: Number(process.env.PORT || 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || '',
  adminKey: process.env.ADMIN_DASHBOARD_KEY || '',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpSecure: parseBoolean(process.env.SMTP_SECURE, false),
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  emailFrom: process.env.EMAIL_FROM || '',
  notifyTo: process.env.NOTIFY_TO || '',
};

export function isEmailConfigured() {
  return Boolean(env.smtpHost && env.smtpUser && env.smtpPass && env.emailFrom && env.notifyTo);
}

export function isDatabaseConfigured() {
  return Boolean(env.databaseUrl);
}

export function isAdminConfigured() {
  return Boolean(env.adminKey);
}
