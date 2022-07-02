import { Response, Request, NextFunction } from 'express';

import { SESSION_COOKIE_NAME } from '../constant/session';
import { UserSession } from '../database/entity/user-session.entity';
import { revokeSession } from '../database/sessions';

export const antiCSRFMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const {
		body: { antiCSRF },
		session,
	} = req as Request & { session: UserSession };

	/* if there is no anti CSRF or if it is invalid, then sometimes may be trying to attack us */
	if (antiCSRF === undefined || session.antiCSRF !== antiCSRF) {
		await revokeSession(session.id);
		res.clearCookie(SESSION_COOKIE_NAME);

		return res.redirect('/signin?error=invalid_anti_csrf_token');
	}

	next();
};
