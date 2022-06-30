import 'dotenv/config';
import express from 'express';

import { CamagaruDataSource } from './database/data-source';
import { webRouter } from './routes/web';

const bootstrap = async () => {
	const app = express();

	const PORT = process.env.HTTP_LISTENING_PORT ?? 5000;

	await CamagaruDataSource.initialize();

	app.set('views', './src/view')
	app.set('view engine', 'ejs');

	app.use(express.static('./src/public'))
	app.use('', webRouter);

	app.listen(PORT, () => {
		console.info(`Camagaru API started, listening on port ${PORT}`);
	});

};

bootstrap();
