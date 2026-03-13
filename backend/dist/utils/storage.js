import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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
export function readMessages() {
    ensureMessagesFile();
    return JSON.parse(fs.readFileSync(messagesFile, 'utf-8'));
}
export function saveMessage(message) {
    const messages = readMessages();
    messages.unshift(message);
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf-8');
}
