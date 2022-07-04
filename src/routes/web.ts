import { Router, Request } from 'express';
import { createReadStream, createWriteStream, existsSync } from 'fs';
import { join } from 'path';

import { USER_IMAGE_PATH } from '../constant/superposable-picture';
import { tabs } from '../constant/tabs';
import { AuthenticatedRequest, sessionMiddleware } from '../middleware/session.middleware';
import { getSurperposablePictureUrls } from '../utils/get-superposable-picture-urls';
import { getUserMediaIds } from '../utils/user-media';

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
	const mediaIds = getUserMediaIds((req as AuthenticatedRequest).session);

	res.render('make', {
		superposablePictureUrls,
		...getNavData(req),
		mediaIds,
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

webRouter.get('/usermedia/:mediaId', sessionMiddleware, (req, res) => {
	const { mediaId } = req.params;
	const {
		session: {
			user: { id: userId },
		},
	} = req as AuthenticatedRequest;
	const mediaFullPath = join(USER_IMAGE_PATH, String(userId), `${mediaId}.png`);

	if (!existsSync(mediaFullPath)) {
		return res.status(400).send('No such media');
	}

	const stream = createReadStream(mediaFullPath);

	res.setHeader('Content-Type', 'image/png');
	stream.pipe(res);
});
