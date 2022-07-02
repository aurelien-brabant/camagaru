import { Router, Request } from 'express';

import { UserSession } from '../database/entity/user-session.entity';
import { AuthenticatedRequest, sessionMiddleware } from '../middleware/session.middleware';

export const webRouter = Router();

webRouter.get('/', (req, res) => {
	res.render('index');
});

webRouter.get('/signup', (req, res) => {
	res.render('signup');
});

webRouter.get('/signin', (req, res) => {
	res.render('signin');
});

webRouter.get('/profile', sessionMiddleware, (req, res) => {
	console.log((req as any).session);
	//
	res.render('profile', {
		session: (req as AuthenticatedRequest).session,
		test: 5,
	});
});
