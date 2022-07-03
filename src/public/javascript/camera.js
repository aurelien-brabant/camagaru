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

		return data;
	};

	const superposableImages = document.getElementsByClassName('superposable-image');

	/**
	 * @type {HTMLImageElement | null}
	 */
	let selectedSuperposableImage = null;

	let selectedPictureName = null;

	for (const superposableImage of superposableImages) {
		superposableImage.addEventListener('click', () => {
			selectedPictureName = superposableImage.getAttribute('id');
			selectedSuperposableImage = superposableImage;
			superposableImage.classList.add('ring-2');
			superposableImage.classList.add('ring-indigo-500');
			superposableImage.classList.add('animate-pulse');

			for (const image of superposableImages) {
				if (image !== superposableImage) {
					image.classList.remove('ring-2');
					image.classList.remove('ring-indigo-500');
					image.classList.remove('animate-pulse');
				}
			}
		});
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
		cameraPhotoTrigger.addEventListener('click', async () => {
			const dataUrl = takePicture();

			const res = await fetch('/api/generate-image', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: `camera=${dataUrl}&superposableImageName=${selectedPictureName}`,
			});

			if (!res.ok) {
				console.error('Something went wrong while generating the photo!');
			}
		});
	} else {
		console.error(`Could not find photo trigger with id ${CAMERA_PHOTO_TRIGGER_ID}`);
	}
})();
