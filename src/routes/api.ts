import { hash as hashPassword, compare as comparePasswords } from 'bcrypt';
import { Router } from 'express';

import { CamagaruDataSource } from '../../src/database/data-source';
import { User } from '../database/entity/user.entity';

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
		.select('user.password')
		.getOne();

	if (!user || !(await comparePasswords(password, user.password))) {
		return res.redirect('/signin?error=invalid_credentials');
	}

	return res.redirect('/?code=signin_success');
});
