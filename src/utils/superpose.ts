import { subClass } from 'gm';
import { join } from 'path';

import { SUPERPOSABLE_PICTURE_PATH } from '../constant/superposable-picture';

/**
 * Requires the imagemagick to be installed on the system
 */
const imageMagick = subClass({ imageMagick: true });

export const superposeImages = async (baseImage: Buffer, superposableImage: Buffer) => {
	const composited = imageMagick(baseImage)
		.composite(join(SUPERPOSABLE_PICTURE_PATH, 'screaming_cat.png'))
		.write('camera.png', (err) => {
			if (!err) {
				console.log('Successful composition');
			} else {
				console.error(err);
			}
		});
};
