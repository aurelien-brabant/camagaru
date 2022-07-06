import { existsSync, mkdirSync } from 'fs';
import { subClass } from 'gm';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

import { SUPERPOSABLE_PICTURE_PATH, USER_IMAGE_PATH } from '../constant/superposable-picture';
import { insertPicture } from '../database/query/picture';
import { ActiveUserSession } from '../database/query/session';

/**
 * Requires the imagemagick to be installed on the system
 */
const imageMagick = subClass({ imageMagick: true });

export const superposeImages = async (baseImage: Buffer, superposableImageName: string, session: ActiveUserSession) => {
	const userImageDirectoryPath = join(USER_IMAGE_PATH);
	const imageId = uuidv4();
	const imagePath = join(userImageDirectoryPath, `${imageId}.png`);

	if (!existsSync(userImageDirectoryPath)) {
		mkdirSync(userImageDirectoryPath);
	}

	console.log({ baseImage });
	imageMagick(baseImage)
		.composite(join(SUPERPOSABLE_PICTURE_PATH, `${superposableImageName}.png`))
		.write(imagePath, (err) => {
			if (!err) {
				console.log('Successful composition');
			} else {
				console.error(err);
			}
		});

	await insertPicture(imageId, session.user.id);
};
