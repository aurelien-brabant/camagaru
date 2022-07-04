import { Request, Response, NextFunction } from 'express';

import { ActiveUserSession, selectActiveSessionById } from '../database/query/session';

export type AuthenticatedRequest = Request & { session: ActiveUserSession };

export const sessionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const { session_id: sessionId } = req.cookies;

	if (!sessionId) {
		return res.redirect('/signin?error=unauthorized');
	}

	const session = await selectActiveSessionById(sessionId);

	if (!session) {
		return res.redirect('/signin?error=unauthorized');
	}

	(req as any).session = session;

	next();
};
