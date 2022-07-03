import { doesNotReject } from 'assert';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

import { SUPERPOSABLE_PICTURE_PATH } from '../constant/superposable-picture';

export const getSurperposablePictureUrls = (): string[] => {
	const directory = readdirSync(SUPERPOSABLE_PICTURE_PATH);

	return directory.map((file) => `/superposable-picture/${file}`);
};

export const getSuperposablePhotoByName = (name: string): Buffer | null => {
	try {
		const buffer = readFileSync(join(SUPERPOSABLE_PICTURE_PATH, `${name}.png`));

		return buffer;
	} catch (error) {
		return null;
	}
};
