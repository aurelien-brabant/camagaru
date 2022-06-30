import { DataSource } from 'typeorm';

import { AccountValidationToken } from './entity/account-validation-token.entity';
import { User } from './entity/user.entity';

export const CamagaruDataSource = new DataSource({
	type: 'postgres',
	host: process.env.POSTGRES_HOST,
	port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	entities: [User, AccountValidationToken],
	synchronize: process.env.NODE_ENV === 'development' || process.env.SYNCHRONIZE_DB === 'true',
});
