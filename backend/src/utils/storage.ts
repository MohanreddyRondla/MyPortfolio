import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getMessages as getMessagesFromDb, initializeDatabase, insertMessage } from '../lib/database.js';
import { isDatabaseConfigured } from '../lib/env.js';
import type { StoredMessage } from '../types/message.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../../data');
const messagesFile = path.join(dataDir, 'messages.json');

function ensureMessagesFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(messagesFile)) {
    fs.writeFileSync(messagesFile, '[]', 'utf-8');
  }
}

function readMessagesFromFile(): StoredMessage[] {
  ensureMessagesFile();
  return JSON.parse(fs.readFileSync(messagesFile, 'utf-8')) as StoredMessage[];
}

function saveMessageToFile(message: StoredMessage) {
  const messages = readMessagesFromFile();
  messages.unshift(message);
  fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf-8');
}

export async function initializeMessageStore() {
  ensureMessagesFile();

  if (isDatabaseConfigured()) {
    await initializeDatabase();
  }
}

export async function readMessages(): Promise<StoredMessage[]> {
  if (isDatabaseConfigured()) {
    return getMessagesFromDb();
  }

  return readMessagesFromFile();
}

export async function saveMessage(message: StoredMessage) {
  if (isDatabaseConfigured()) {
    await insertMessage(message);
    return;
  }

  saveMessageToFile(message);
}
