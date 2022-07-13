import { hash as hashPassword, compare as comparePasswords } from 'bcrypt';
import { Router } from 'express';

import { getLastPicturesWithComments, insertPictureComment } from '../database/query/picture';
import { openUserSession, revokeSession, revokeUserSessions } from '../database/query/session';
import { insertUser, queryUserByEmailWithPassword, User } from '../database/query/user';
import { antiCSRFMiddleware } from '../middleware/anti-csrf.middleware';
import { AuthenticatedRequest, sessionMiddleware } from '../middleware/session.middleware';
import { getSuperposablePhotoByName } from '../utils/get-superposable-picture-urls';
import { parseCameraPayload } from '../utils/parse-camera-payload';
import { superposeImages } from '../utils/superpose';

export const apiRouter = Router();

const SALT_ROUNDS = 10;

apiRouter.post('/signup', async (req, res) => {
	const { email, username, password } = req.body;

	if (email === undefined || username === undefined || password === undefined) {
		return res.redirect('/signup?error=invalid_payload');
	}

	const existingUser = await queryUserByEmailWithPassword(email);

	if (existingUser) {
		return res.redirect('/signup?error=already_exists');
	}

	await insertUser({
		email,
		username,
		password,
	});

	return res.redirect('/signin?code=signup_success');
});

apiRouter.post('/signin', async (req, res) => {
	const { email, password } = req.body;

	if (email === undefined || password === undefined) {
		return res.redirect('/signin?error=invalid_payload');
	}

	const user = await queryUserByEmailWithPassword(email);

	if (!user || !(await comparePasswords(password, user.password))) {
		return res.redirect('/signin?error=invalid_credentials');
	}

	const sessionId = await openUserSession(user.id);

	res.cookie('session_id', sessionId);

	return res.redirect('/?code=signin_success');
});

apiRouter.get('/logout', sessionMiddleware, async (req, res) => {
	const { all } = req.query;
	const {
		session: { user },
	} = req as AuthenticatedRequest;
	const { session_id: sessionId } = req.cookies;

	/* if 'all' query param is set to 'true' disconnect user from everywhere */
	if (all === 'true') {
		await revokeUserSessions(user.id);
	} else {
		await revokeSession(sessionId);
	}

	res.clearCookie('session_id');

	res.redirect('/signin?code=logout_success');
});

apiRouter.post('/profile', sessionMiddleware, antiCSRFMiddleware, async (req, res) => {
	const payload = req.body as Partial<User & { password: string }>;

	if (typeof payload.password === 'string') {
		payload.password = await hashPassword(payload.password, SALT_ROUNDS);
	}

	return res.redirect('/profile?code=edit_success');
});

apiRouter.post('/generate-image', sessionMiddleware, async (req, res) => {
	const { camera, superposableImageName } = req.body;

	const cameraPhoto = parseCameraPayload(camera);

	/*if (!superposable) {
		return res.status(400).json({
			message: 'No such superposable image',
		});
	}
	*/

	//e

	await superposeImages(cameraPhoto, superposableImageName, (req as AuthenticatedRequest).session);

	return res.status(200).json({
		message: 'Style!',
	});
});

apiRouter.get('/pictures', async (req, res) => {
	const { page, perPage } = req.query;

	if ((typeof page === 'string' && isNaN(+page)) || (typeof perPage === 'string' && isNaN(+perPage))) {
		return res.status(400).json({
			message: 'page and perPage must be numbers (if specified)',
		});
	}

	const pictures = await getLastPicturesWithComments(page ? +page : 1, perPage ? +perPage : 10);

	return res.status(200).json(pictures);
});

apiRouter.post('/pictures/:pictureId/comments', sessionMiddleware, async (req, res) => {
	const {
		session,
		params: { pictureId },
		body,
	} = req as AuthenticatedRequest;

	if (typeof pictureId !== 'string') {
		return res.status(400).end();
	}

	console.log(body);

	try {
		const comment = await insertPictureComment(pictureId, session.user, body.content);

		return res.status(200).json(comment);
	} catch (error) {
		console.error(error);

		return res.status(500).json({ message: 'Internal Server Error' });
	}
});
