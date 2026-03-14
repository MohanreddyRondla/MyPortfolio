function parseBoolean(value: string | undefined, fallback = false) {
  if (value == null) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}


export const env = {
  port: Number(process.env.PORT || 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || "*",
  adminDashboardKey: process.env.ADMIN_DASHBOARD_KEY || "123456",
  databaseUrl: process.env.DATABASE_URL || "",
  smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpSecure: process.env.SMTP_SECURE === "false",
  smtpUser: process.env.SMTP_USER || "mohanreddyrondla11@gmail.com",
  smtpPass: process.env.SMTP_PASS || "Mohanreddy@21099",
  emailFrom: process.env.EMAIL_FROM || "mohanreddyrondla11@gmail.com",
  notifyTo: process.env.NOTIFY_TO || "mohanreddyrondla11@gmail.com",
};

export const isDatabaseConfigured = () => Boolean(env.databaseUrl);
export const isAdminConfigured = () => Boolean(env.adminDashboardKey);
export const isEmailConfigured = () =>
  Boolean(env.smtpHost && env.smtpUser && env.smtpPass && env.notifyTo);
