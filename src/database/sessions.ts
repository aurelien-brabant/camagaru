import { createHash } from 'crypto';

import { CamagaruDataSource } from '../../src/database/data-source';
import { UserSession } from './entity/user-session.entity';

const SESSION_SECRET = process.env.SESSION_SECRET ?? 'secret';
const ANTI_CSRF_SECRET = process.env.CSRF_SECRET ?? 'secret';

const generateSessionId = (userId: number): string => {
	const randomNumbers = Array.from({ length: 10 }, () => Math.random() * Number.MAX_VALUE);

	const hash = createHash('sha256').update(`${userId}${SESSION_SECRET}${randomNumbers.join('')}`);

	return hash.digest('hex');
};

const generateAntiCSRF = (userId: number): string => {
	const randomNumbers = Array.from({ length: 10 }, () => Math.random() * Number.MAX_VALUE);
	const hash = createHash('sha256').update(`${userId}${ANTI_CSRF_SECRET}${randomNumbers.join('')}`);

	return hash.digest('hex');
}

export const getSession = async (sessionId: string): Promise<UserSession | null> => {
	const sessionRepository = CamagaruDataSource.getRepository(UserSession);

	const session = await sessionRepository.findOne({
		where: {
			id: sessionId,
		},
		relations: ['user'],
	});

	return session;
};

export const createUserSession = async (userId: number): Promise<UserSession> => {
	const sessionRepository = CamagaruDataSource.getRepository(UserSession);
	const sessionId = generateSessionId(userId);
	const antiCSRF = generateAntiCSRF(userId);

	const createdSession = sessionRepository.create({
		id: sessionId,
		user: {
			id: userId,
		},
		antiCSRF
	});

	const session = await sessionRepository.save(createdSession);

	return session;
};
