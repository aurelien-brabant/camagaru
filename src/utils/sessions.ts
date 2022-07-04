import { createHash } from 'crypto';
import ms from 'ms';
import { v4 as uuidv4 } from 'uuid';

const SESSION_SECRET = process.env.SESSION_SECRET ?? 'secret';
const ANTI_CSRF_SECRET = process.env.CSRF_SECRET ?? 'secret';

const generateRandomId = (words: string[], randomNumberAmount: number) => {
	const now = Date.now();
	const uuid = uuidv4();
	const randomNumbers = Array.from({ length: randomNumberAmount }, () => Math.random() * Number.MAX_VALUE);
	const hash = createHash('sha256').update(`${now}${uuid}${randomNumbers.join('')}${words.join('')}`);

	return hash.digest('hex');
};

export const generateSessionId = (userId: number): string => generateRandomId([String(userId), SESSION_SECRET], 10);

export const generateAntiCsrf = (userId: number): string => generateRandomId([String(userId), ANTI_CSRF_SECRET], 10);
