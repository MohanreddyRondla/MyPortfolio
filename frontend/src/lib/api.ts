import type { AdminMessagesResponse, PortfolioData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export async function getPortfolioData(): Promise<PortfolioData> {
  const response = await fetch(`${API_BASE_URL}/api/portfolio`);
  if (!response.ok) {
    throw new Error('Failed to load portfolio data');
  }
  return response.json();
}

export async function submitContactForm(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Failed to send message');
  }

  return data as { message: string };
}

export async function getAdminMessages(adminKey: string): Promise<AdminMessagesResponse> {
  const response = await fetch(`${API_BASE_URL}/api/admin/messages`, {
    headers: {
      'x-admin-key': adminKey,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'Failed to load admin messages');
  }

  return data as AdminMessagesResponse;
}

export function getExportUrl(adminKey: string, format: 'json' | 'csv') {
  const url = new URL(`${API_BASE_URL}/api/admin/messages/export`);
  url.searchParams.set('format', format);
  url.searchParams.set('adminKey', adminKey);
  return url.toString();
}
