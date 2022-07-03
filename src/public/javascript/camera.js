/**
 * Camera controller
 *
 * Heavily inspired from MDN's tutorial: https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API/Taking_still_photos
 */

(async () => {
	const VIDEO_OUTPUT_ID = 'camera-video';
	const CAMERA_PHOTO_TRIGGER_ID = 'camera-photo-trigger';
	const CAMERA_HIDDEN_CANVAS_ID = 'camera-hidden-canvas';
	const HIDDEN_CANVAS_PHOTO_ID = 'hidden-canvas-photo';

	/**
	 * @type {HTMLVideoElement | null}
	 */
	const video = document.getElementById(VIDEO_OUTPUT_ID);

	/**
	 * @type {HTMLButtonElement | null}
	 */
	const cameraPhotoTrigger = document.getElementById(CAMERA_PHOTO_TRIGGER_ID);

	/**
	 * @type {HTMLCanvasElement | null}
	 */
	const hiddenCanvas = document.getElementById(CAMERA_HIDDEN_CANVAS_ID);

	/**
	 * @type {HTMLImageElement | null}
	 */
	const hiddenCanvasPhoto = document.getElementById(HIDDEN_CANVAS_PHOTO_ID);

	/**
	 * @type {MediaStream | null}
	 */
	let stream = null;

	const takePicture = () => {
		if (!hiddenCanvas) {
			console.error(`Could not find canvas with id ${CAMERA_HIDDEN_CANVAS_ID}`);

			return;
		}

		const canvasContext = hiddenCanvas.getContext('2d');

		hiddenCanvas.width = video.videoWidth;
		hiddenCanvas.height = video.videoHeight;
		canvasContext.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

		const data = hiddenCanvas.toDataURL('image/png');

		hiddenCanvasPhoto.setAttribute('src', data);
	};

	const superposableImages = document.getElementsByClassName('superposable-image');

	for (const superposableImage of superposableImages) {
		superposableImage.addEventListener('click', () => {});
	}

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
			takePicture();
		});
	} else {
		console.error(`Could not find photo trigger with id ${CAMERA_PHOTO_TRIGGER_ID}`);
	}
})();
