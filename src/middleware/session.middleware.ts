import { Request, Response, NextFunction } from 'express';

import { getSession } from '../database/sessions';

export const sessionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const { session_id: sessionId } = req.cookies;

	if (!sessionId) {
		return res.redirect('/signin?error=unauthorized');
	}

	const session = await getSession(sessionId);

	if (!session) {
		return res.redirect('/signin?error=unauthorized');
	}

	(req as any).session = session;

	next();
};
