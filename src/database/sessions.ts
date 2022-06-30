import { createHash } from 'crypto';

import { CamagaruDataSource } from '../../src/database/data-source';
import { UserSession } from './entity/user-session.entity';

const SESSION_SECRET = process.env.SESSION_SECRET ?? 'secret';

const generateSessionId = (userId): string => {
	const n = Math.random() * Number.MAX_VALUE;

	const hash = createHash('sha256').update(`${userId}${SESSION_SECRET}${n}`);

	return hash.digest('hex');
};

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

	const createdSession = sessionRepository.create({
		id: sessionId,
		user: {
			id: userId,
		},
	});

	const session = await sessionRepository.save(createdSession);

	return session;
};
