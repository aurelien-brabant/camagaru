import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

import { USER_IMAGE_PATH } from '../constant/superposable-picture';
import { ActiveUserSession } from '../database/query/session';

export const getUserMediaIds = (session: ActiveUserSession) => {
	const userMediaDirectoryPath = join(USER_IMAGE_PATH, String(session.user.id));

	if (!existsSync(userMediaDirectoryPath)) {
		mkdirSync(userMediaDirectoryPath);
	}

	return readdirSync(userMediaDirectoryPath).map((filename) => filename.split('.').slice(0, -1).join(''));
};
