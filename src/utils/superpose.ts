import { existsSync, mkdirSync } from 'fs';
import { subClass } from 'gm';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

import { SUPERPOSABLE_PICTURE_PATH, USER_IMAGE_PATH } from '../constant/superposable-picture';
import { UserSession } from '../database/entity/user-session.entity';

/**
 * Requires the imagemagick to be installed on the system
 */
const imageMagick = subClass({ imageMagick: true });

export const superposeImages = async (baseImage: Buffer, superposableImageName: string, session: UserSession) => {
	const userImageDirectoryPath = join(USER_IMAGE_PATH, String(session.user.id));
	const imageId = uuidv4();
	const imagePath = join(userImageDirectoryPath, `${imageId}.png`);

	if (!existsSync(userImageDirectoryPath)) {
		mkdirSync(userImageDirectoryPath);
	}

	imageMagick(baseImage)
		.composite(join(SUPERPOSABLE_PICTURE_PATH, 'screaming_cat.png'))
		.write(imagePath, (err) => {
			if (!err) {
				console.log('Successful composition');
			} else {
				console.error(err);
			}
		});
};
