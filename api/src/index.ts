import 'dotenv/config';
import express from 'express';
import { isErrored } from 'stream';

import { CamagaruDataSource } from './database/data-source';
import { User } from './entity/user.entity';

const bootstrap = async () => {
	const app = express();

	const PORT = process.env.HTTP_LISTENING_PORT ?? 5000;

	await CamagaruDataSource.initialize();

	const user = CamagaruDataSource.getRepository(User);

	const users = await user.find();

	console.log(users);

	app.listen(PORT, () => {
		console.info(`Camagaru API started, listening on port ${PORT}`);
	});

	app.get('/', (req, res) => {
		return res.status(200).json({
			message: 'Welcome to the Camagaru API root endpoint!',
		});
	});
};

bootstrap();
