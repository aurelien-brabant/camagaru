import { db } from '../connection';
import { User } from './user';

export type PictureWithComments = {
	id: string;
	owner: User;
	createdAt: Date;
	likeCount: number;
	comments: PictureCommentPage;
	url: string;
};

export type Picture = {
	id: string;
	owner: User;
	createdAt: Date;
	likeCount: number;
	commentCount: number;
	url: string;
};

export type PictureCommentPage = {
	totalResults: number;
	page: number;
	perPage: number;
	comments: PictureComment[];
};

export type PictureComment = {
	id: number;
	content: string;
	authorUsername: string;
};

export const getPictureUrl = (pictureId: string) => `/pictures/${pictureId}.png`;

export const getPictureCommentCount = async (pictureId: string): Promise<number> => {
	const {
		rows: [{ count }],
	} = await db.query(
		`
        SELECT
            COUNT(*)
        FROM
            picture_comments
        WHERE
            picture_id = $1
    `,
		[pictureId],
	);

	return count;
};

export const getPictureComments = async (pictureId: string, page = 1, perPage = 10): Promise<PictureCommentPage> => {
	const {
		rows: [{ count }],
	} = await db.query(
		`
        SELECT
            COUNT(*)
        FROM
            picture_comments
        WHERE
            picture_id = $1
    `,
		[pictureId],
	);

	const { rows } = await db.query(
		`
        SELECT
            picture_comments.id,
            picture_comments.content,
            users.username as author_username
        FROM
            picture_comments
        JOIN
            pictures
        ON
            pictures.id = picture_comments.picture_id
        JOIN
            users
        ON
            users.id = picture_comments.author_id
        WHERE
            pictures.id = $1
        ORDER BY
            picture_comments.created_at
        DESC
        OFFSET
            $2
        LIMIT
            $3
    `,
		[pictureId, (page - 1) * perPage, perPage],
	);

	const comments = rows.map(({ author_username, id, content }) => ({
		authorUsername: author_username,
		content,
		id,
	}));

	return {
		page,
		perPage,
		totalResults: +count,
		comments,
	};
};

export const getLastPictures = async (page = 1, perPage = 25): Promise<Picture[]> => {
	const { rows } = await db.query(
		`
        SELECT
            pictures.id,
            pictures.like_count,
            pictures.created_at,
            users.id as user_id,
            users.email as user_email,
            users.username
        FROM
            pictures
        JOIN
            users
        ON
            users.id = pictures.owner_id 
        ORDER BY
            created_at
        DESC
        OFFSET
            $1
        LIMIT
            $2
    `,
		[(page - 1) * perPage, page * perPage],
	);

	return Promise.all(
		rows.map(async ({ user_email, user_id, username, ...picture }) => ({
			id: picture.id,
			createdAt: picture.created_at,
			likeCount: picture.like_count,
			url: getPictureUrl(picture.id),
			commentCount: await getPictureCommentCount(picture.id),
			owner: {
				id: user_id,
				email: user_email,
				username,
			},
		})),
	);
};

export const getLastPicturesWithComments = async (page = 1, perPage = 25): Promise<PictureWithComments[]> => {
	const { rows } = await db.query(
		`
        SELECT
            pictures.id,
            pictures.like_count,
            pictures.created_at,
            users.id as user_id,
            users.email as user_email,
            users.username
        FROM
            pictures
        JOIN
            users
        ON
            users.id = pictures.owner_id 
        ORDER BY
            created_at
        DESC
        OFFSET
            $1
        LIMIT
            $2
    `,
		[(page - 1) * perPage, perPage],
	);

	return Promise.all(
		rows.map(async ({ user_email, user_id, username, ...picture }) => ({
			id: picture.id,
			createdAt: picture.created_at,
			likeCount: picture.like_count,
			comments: await getPictureComments(picture.id, 1) /* fetch first comment page */,
			url: getPictureUrl(picture.id),
			owner: {
				id: user_id,
				email: user_email,
				username,
			},
		})),
	);
};

export const insertPicture = async (pictureId: string, authorId: number): Promise<void> => {
	await db.query(
		`
        INSERT INTO
            pictures (
                id,
                owner_id
            )
        VALUES (
            $1,
            $2
        )
    `,
		[pictureId, authorId],
	);
};

export const insertPictureComment = async (
	pictureId: string,
	author: User,
	content: string,
): Promise<PictureComment> => {
	const {
		rows: [{ id: commentId }],
	} = await db.query(
		`
        INSERT INTO
            picture_comments (
                picture_id,
                author_id,
                content
            )
        VALUES (
            $1,
            $2,
            $3
        )
        RETURNING
            id
    `,
		[pictureId, author.id, content],
	);

	return {
		authorUsername: author.username,
		content,
		id: commentId,
	};
};
