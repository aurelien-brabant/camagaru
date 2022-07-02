import { readdirSync } from 'fs';

import { SUPERPOSABLE_PICTURE_PATH } from '../constant/superposable-picture';

export const getSurperposablePictureUrls = (): string[] => {
	const directory = readdirSync(SUPERPOSABLE_PICTURE_PATH);

	return directory.map((file) => `/superposable-picture/${file}`);
};
