import { Router } from 'express';

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

webRouter.get('/profile', (req, res) => {
	res.render('profile');
});
