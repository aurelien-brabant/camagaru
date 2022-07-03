import { Router, Request } from 'express';

import { tabs } from '../constant/tabs';
import { AuthenticatedRequest, sessionMiddleware } from '../middleware/session.middleware';
import { getSurperposablePictureUrls } from '../utils/get-superposable-picture-urls';

export const webRouter = Router();

const getNavData = (req: Request) => {
	return {
		tabs: tabs,
		path: req.path,
	};
};

webRouter.get('/', sessionMiddleware, (req, res) => {
	const superposablePictureUrls = getSurperposablePictureUrls();

	res.render('index', {
		superposablePictureUrls,
		...getNavData(req),
	});
});

webRouter.get('/gallery', sessionMiddleware, (req, res) => {
	const superposablePictureUrls = getSurperposablePictureUrls();

	res.render('index', {
		superposablePictureUrls,
		...getNavData(req),
	});
});

webRouter.get('/make', sessionMiddleware, (req, res) => {
	const superposablePictureUrls = getSurperposablePictureUrls();

	res.render('index', {
		superposablePictureUrls,
		...getNavData(req),
	});
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
