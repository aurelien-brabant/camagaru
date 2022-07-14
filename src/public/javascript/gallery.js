(() => {
	/**
	 * @typedef {{
	 *  id: string;
	 *  owner: {
	 *    id: number;
	 *    email: string;
	 *    username: string;
	 *  };
	 *  createdAt: string;
	 *  likeCount: number;
	 *  comments: {
	 * 		page: number;
	 * 		perPage: number;
	 *		totalResults: number;
	 *		comments: any[]
	 * 	};
	 *  url: string;
	 * }} PictureWithComments
	 */

	/**
	 * @typedef {{
	 *  id: string;
	 *  content: string;
	 *  authorUsername: string;
	 * }} PictureComment
	 */

	/**
	 * @type {Object.<string, PictureWithComments>}
	 */
	const pictureIdToLoadedPicture = {};

	const RECENT_COMMENTS_DISPLAY_COUNT = 3;

	let currentPage = 1;

	const feed = document.getElementById('feed');

	/* TODO: when user is near to the bottom of the page fetch new images and append them to the DOM to allow 'infinite' scrolling */
	window.addEventListener('scroll', () => {});

	if (!feed) {
		console.error("Could not find the feed element: we'll have nothing to attach pictures to!");
	}

	/**
	 *
	 * @returns {Promise<PictureWithComments[]>}
	 */
	const fetchImages = async () => {
		const res = await fetch(`/api/pictures?page=${currentPage}&perPage=25`);

		if (res.ok) {
			++currentPage;
		}

		return res.json();
	};

	/**
	 * @param {PictureWithComments} picture
	 *
	 * @returns {HTMLDivElement}
	 */
	const generatePictureElement = (picture) => {
		let isCommentSectionExpanded = false;
		let asynchronouslyPostedCommentCount = 0;
		let commentPage = 1;
		let areAllCommentsLoaded = false;
		let isLoadingMoreComments = false;
		/**
		 * @type {HTMLElement[]}
		 */
		const loadedComments = [];

		const cardWrapper = document.createElement('div');

		cardWrapper.setAttribute('class', 'max-w-sm rounded overflow-hidden shadow-sm border-black/10 border');

		const cardHeader = document.createElement('header');

		const letterLogo = document.createElement('div');

		letterLogo.setAttribute('class', 'shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center');
		letterLogo.innerText = picture.owner.username[0].toUpperCase();

		const cardTitle = document.createElement('div');

		cardTitle.setAttribute('class', 'text-sm flex flex-col justify-between');

		const cardUsername = document.createElement('div');
		const cardDate = document.createElement('div');

		cardUsername.innerText = picture.owner.username;
		cardUsername.setAttribute('class', 'font-medium');

		cardDate.innerText = new Date(picture.createdAt).toLocaleDateString();
		cardDate.setAttribute('class', 'text-xs');

		cardTitle.append(cardUsername, cardDate);

		cardHeader.setAttribute('class', 'py-3 px-4 flex items-center gap-x-2');
		cardHeader.append(letterLogo, cardTitle);

		const img = document.createElement('img');

		img.setAttribute('class', 'w-full');
		img.setAttribute('src', picture.url);
		img.setAttribute('alt', picture.id);

		const cardBody = document.createElement('div');

		cardBody.setAttribute('class', 'px-4 py-3');

		const actionBar = document.createElement('div');

		actionBar.setAttribute('class', 'flex items-center gap-x-4');

		const likeButton = document.createElement('button');
		const commentButton = document.createElement('button');

		likeButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        `;
		commentButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
        `;

		actionBar.append(likeButton, commentButton);

		const likeCount = document.createElement('div');

		likeCount.setAttribute('class', 'font-medium mt-2 text-sm');
		likeCount.innerHTML = `${picture.likeCount} likes`;

		const COMMENTS_PER_PAGE = 25;

		const loadMoreComments = async () => {
			if (isLoadingMoreComments || areAllCommentsLoaded) {
				return;
			}

			isLoadingMoreComments = true;
			const res = await fetch(
				`/api/pictures/${picture.id}/comments?page=${commentPage}&perPage=${COMMENTS_PER_PAGE}`,
			);

			if (res.ok) {
				const { comments, page, perPage, totalResults } = await res.json();

				areAllCommentsLoaded = (page - 1) * perPage + comments.length >= totalResults;
				loadedComments.push(...comments.map((comment) => makeCommentElement(comment)));
				renderComments();
				++commentPage;
			}
			isLoadingMoreComments = false;
		};

		loadMoreComments();

		const commentPreviewSection = document.createElement('div');
		commentPreviewSection.setAttribute(
			'class',
			`mt-2 max-h-80 py-2 border-black/10 overflow-x-hidden overflow-y-scroll`,
		);

		commentPreviewSection.addEventListener('scroll', async (event) => {
			const { clientHeight, scrollHeight, scrollTop } = commentPreviewSection;
			const distanceFromBottom = Math.abs(scrollHeight - clientHeight - scrollTop);

			if (distanceFromBottom < 30) {
				await loadMoreComments();
			}
		});

		const commentViewAllButtonEl = document.createElement('button');
		commentViewAllButtonEl.setAttribute('class', 'text-gray-600 text-sm fomt-medium mt-2');

		commentViewAllButtonEl.addEventListener('click', () => {
			isCommentSectionExpanded = !isCommentSectionExpanded;

			renderComments();
		});

		/**
		 *
		 * @param {PictureComment} comment
		 *
		 * @returns {HTMLParagraphElement}
		 */
		const makeCommentElement = (comment) => {
			const commentEl = document.createElement('p');
			commentEl.setAttribute('class', 'text-sm mt-1');
			commentEl.setAttribute('id', `${picture.id}-${comment.id}`);

			const commentAuthorEl = document.createElement('span');
			commentAuthorEl.setAttribute('class', 'font-medium mr-2');
			commentAuthorEl.innerText = comment.authorUsername;

			const commentContentEl = document.createElement('span');
			commentContentEl.innerText = comment.content;

			commentEl.append(commentAuthorEl, commentContentEl);

			return commentEl;
		};

		/* Append most recent comments */
		const renderComments = () => {
			const updatedChildren = loadedComments.slice(
				0,
				isCommentSectionExpanded ? loadedComments.length - 1 : RECENT_COMMENTS_DISPLAY_COUNT,
			);

			commentPreviewSection.replaceChildren(...updatedChildren);

			if (!isCommentSectionExpanded) {
				commentViewAllButtonEl.innerText = `View all ${
					picture.comments.totalResults + asynchronouslyPostedCommentCount
				} comments`;
			} else {
				commentViewAllButtonEl.innerText = 'View less comments...';
			}
		};

		const addCommentSection = document.createElement('form');

		addCommentSection.setAttribute('class', 'text-sm flex items-center p-3 border-t border-black/10');

		const addCommentInput = document.createElement('input');
		addCommentInput.setAttribute('class', 'text-sm focus:outline-0 flex-1 focus:shadow-none focus:ring-0 border-0');
		addCommentInput.setAttribute('placeholder', 'Add a comment');

		const postCommentButton = document.createElement('button');
		postCommentButton.setAttribute('type', 'submit');
		postCommentButton.setAttribute('class', 'text-cyan-700 font-bold px-2 disabled:opacity-50');
		postCommentButton.setAttribute('disabled', '');
		postCommentButton.innerText = 'Post';

		commentButton.addEventListener('click', () => {
			addCommentInput.focus();
		});

		addCommentInput.addEventListener('input', (event) => {
			const isContentPostable = !!addCommentInput.value.trim();

			if (isContentPostable && postCommentButton.hasAttribute('disabled')) {
				postCommentButton.removeAttribute('disabled');
			} else if (!isContentPostable) {
				postCommentButton.setAttribute('disabled', '');
			}
		});

		addCommentSection.addEventListener('submit', async (event) => {
			event.preventDefault();

			const normalizedContent = addCommentInput.value.trim();

			if (!normalizedContent) {
				return;
			}

			const res = await fetch(`/api/pictures/${picture.id}/comments`, {
				method: 'POST',
				body: JSON.stringify({
					content: normalizedContent,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const createdComment = await res.json();

			if (res.ok) {
				const createdCommentElement = makeCommentElement(createdComment);

				addCommentInput.value = '';
				loadedComments.unshift(createdCommentElement);
				++asynchronouslyPostedCommentCount;
				commentPreviewSection.scrollTop = 0;
				renderComments();
			}
		});

		addCommentSection.append(addCommentInput, postCommentButton);

		cardBody.append(actionBar, likeCount, commentPreviewSection, commentViewAllButtonEl);

		cardWrapper.append(cardHeader, img, cardBody, addCommentSection);

		return cardWrapper;
	};

	const loadMorePictures = async () => {
		const pictures = await fetchImages();

		const pictureElements = pictures.map((picture) => generatePictureElement(picture));

		feed?.append(...pictureElements);
	};

	loadMorePictures();
})();
