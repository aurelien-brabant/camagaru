import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express from 'express';

import { apiRouter } from './routes/api';
import { webRouter } from './routes/web';

const bootstrap = async () => {
	const app = express();

	const PORT = process.env.HTTP_LISTENING_PORT ?? 5000;

	app.set('views', './src/view');
	app.set('view engine', 'ejs');

	app.use(cookieParser());
	app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

	app.use(express.static('./src/public'));

	app.use('/', webRouter);
	app.use('/api', apiRouter);

	app.listen(PORT, () => {
		console.info(`Camagaru API started, listening on port ${PORT}`);
	});
};

bootstrap();
