# Portfolio Fullstack Project

This project rebuilds the uploaded Figma-style portfolio into a working fullstack application.

## Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS v4 + Motion
- Backend: Node.js + Express + TypeScript + Zod
- Storage: PostgreSQL when `DATABASE_URL` is configured, with JSON file fallback for local safety
- Notifications: SMTP email notifications through Nodemailer

## Implemented features

- Public portfolio website
- Contact form submission API
- Admin dashboard on the frontend for viewing contact leads
- Protected admin API with `ADMIN_DASHBOARD_KEY`
- PostgreSQL-backed message storage
- JSON and CSV export endpoints for contact submissions
- Email notifications when a new contact form is submitted

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173` and backend runs on `http://localhost:4000`.

## Required environment variables

```env
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
VITE_API_BASE_URL=http://localhost:4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/portfolio_db
ADMIN_DASHBOARD_KEY=change-this-admin-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
NOTIFY_TO=your-email@gmail.com
```

## API endpoints

- `GET /api/health`
- `GET /api/portfolio`
- `POST /api/contact`
- `GET /api/messages`
- `GET /api/admin/messages` with header `x-admin-key`
- `GET /api/admin/messages/export?format=json&adminKey=...`
- `GET /api/admin/messages/export?format=csv&adminKey=...`

## Where to view the leads

Open the portfolio and scroll to the **Admin dashboard** section. Enter the same value you put in `ADMIN_DASHBOARD_KEY`, then load messages.

## PostgreSQL note

The backend auto-creates a `contact_messages` table on startup if it does not already exist.

## Email note

For Gmail SMTP, use an app password instead of your regular account password.
