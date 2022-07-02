import { hash as hashPassword, compare as comparePasswords } from 'bcrypt';
import { Request, Router } from 'express';

import { CamagaruDataSource } from '../../src/database/data-source';
import { UserSession } from '../database/entity/user-session.entity';
import { User } from '../database/entity/user.entity';
import { createUserSession, revokeSession, deleteUserSessions } from '../database/sessions';
import { antiCSRFMiddleware } from '../middleware/anti-csrf.middleware';
import { AuthenticatedRequest, sessionMiddleware } from '../middleware/session.middleware';

export const apiRouter = Router();

const SALT_ROUNDS = 10;

apiRouter.post('/signup', async (req, res) => {
	const { email, username, password } = req.body;

	if (email === undefined || username === undefined || password === undefined) {
		return res.redirect('/signup?error=invalid_payload');
	}

	const userRepository = CamagaruDataSource.getRepository(User);

	const existingUser = await userRepository.findOne({
		where: {
			email,
		},
	});

	if (existingUser) {
		return res.redirect('/signup?error=already_exists');
	}

	const hashedPassword = await hashPassword(password, SALT_ROUNDS);

	const user = userRepository.create({
		email,
		password: hashedPassword,
		username,
	});

	userRepository.save(user);

	return res.redirect('/signin?code=signup_success');
});

apiRouter.post('/signin', async (req, res) => {
	const { email, password } = req.body;

	if (email === undefined || password === undefined) {
		return res.redirect('/signin?error=invalid_payload');
	}

	const userRepository = CamagaruDataSource.getRepository(User);

	const user = await userRepository
		.createQueryBuilder('user')
		.where('email = :email', { email })
		.select(['user.password', 'user.id'])
		.getOne();

	if (!user || !(await comparePasswords(password, user.password))) {
		return res.redirect('/signin?error=invalid_credentials');
	}

	const session = await createUserSession(user.id);

	res.cookie('session_id', session.id);

	return res.redirect('/?code=signin_success');
});

apiRouter.get('/logout', sessionMiddleware, async (req, res) => {
	const { all } = req.query;
	const {
		session: { user },
	} = req as Request & { session: UserSession };
	const { session_id: sessionId } = req.cookies;

	/* if 'all' query param is set to 'true' disconnect user from everywhere */
	if (all === 'true') {
		await deleteUserSessions(user.id);
	} else {
		await revokeSession(sessionId);
	}

	res.clearCookie('session_id');

	res.redirect('/signin?code=logout_success');
});

apiRouter.post('/profile', sessionMiddleware, antiCSRFMiddleware, async (req, res) => {
	const payload = req.body as Partial<User>;

	if (typeof payload.password === 'string') {
		payload.password = await hashPassword(payload.password, SALT_ROUNDS);
	}

	await CamagaruDataSource.getRepository(User).save({
		...(req as AuthenticatedRequest).session.user,
		...payload,
	});

	return res.redirect('/profile?code=edit_success');
});
