import { Request, Response, NextFunction } from 'express';

import { UserSession } from '../database/entity/user-session.entity';
import { getSession } from '../database/sessions';

export type AuthenticatedRequest = Request & { session: UserSession };

export const sessionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const { session_id: sessionId } = req.cookies;

	if (!sessionId) {
		return res.redirect('/signin?error=unauthorized');
	}

	const session = await getSession(sessionId);

	if (!session) {
		return res.redirect('/signin?error=unauthorized');
	}

	if (new Date().getTime() > session.expiresAt.getTime()) {
		return res.redirect('/signin?error=session_expired');
	}

	(req as any).session = session;

	next();
};
