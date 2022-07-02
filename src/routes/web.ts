import { Router, Request } from 'express';

import { AuthenticatedRequest, sessionMiddleware } from '../middleware/session.middleware';

export const webRouter = Router();

webRouter.get('/', sessionMiddleware, (req, res) => {
	res.render('index');
});

webRouter.get('/signup', (req, res) => {
	res.render('signup');
});

webRouter.get('/signin', (req, res) => {
	res.render('signin');
});

webRouter.get('/profile', sessionMiddleware, (req, res) => {
	res.render('profile', {
		session: (req as AuthenticatedRequest).session,
	});
});
