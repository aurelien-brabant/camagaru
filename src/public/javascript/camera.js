/**
 * Camera controller
 *
 * Heavily inspired from MDN's tutorial: https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API/Taking_still_photos
 */

(async () => {
	const VIDEO_OUTPUT_ID = 'camera-video';
	const CAMERA_PHOTO_TRIGGER_ID = 'camera-photo-trigger';

	/**
	 * @type {HTMLVideoElement | null}
	 */
	const video = document.getElementById(VIDEO_OUTPUT_ID);

	/**
	 * @type {HTMLButtonElement | null}
	 */
	const cameraPhotoTrigger = document.getElementById(CAMERA_PHOTO_TRIGGER_ID);

	/**
	 * @type {MediaStream | null}
	 */
	let stream = null;

	if (video) {
		try {
			stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

			video.srcObject = stream;
			video.play();
		} catch (error) {
			console.error(`Could not get user media: ${error}`);
		}
	} else {
		console.error(`Could not find video element with id ${VIDEO_OUTPUT_ID}`);
	}

	if (cameraPhotoTrigger) {
		cameraPhotoTrigger.addEventListener('click', () => {
			alert('CHEESE!');
		});
	} else {
		console.error(`Could not find photo trigger with id ${CAMERA_PHOTO_TRIGGER_ID}`);
	}
})();
