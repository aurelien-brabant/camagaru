import ms from 'ms';

import { generateAntiCsrf, generateSessionId } from '../../utils/sessions';
import { db } from '../connection';

export type ActiveUserSession = {
	id: string;
	antiCsrfToken: string;
	user: {
		id: number;
		email: string;
		username: string;
	};
};

export const selectActiveSessionById = async (sessionId: string): Promise<ActiveUserSession | null> => {
	const {
		rows: [row],
	} = await db.query(
		`
        SELECT
            user_sessions.id as session_id,
            user_sessions.anti_csrf_token,
            users.id as user_id,
            users.email,
            users.username
        FROM
            user_sessions
        JOIN
            users
        ON
            users.id = user_sessions.user_id
        WHERE
            user_sessions.expires_at > CURRENT_TIMESTAMP
        AND
            user_sessions.id = $1
    `,
		[sessionId],
	);

	if (!row) {
		return null;
	}

	const { anti_csrf_token, session_id, user_id, email, username } = row;

	return {
		id: session_id,
		antiCsrfToken: anti_csrf_token,
		user: {
			id: user_id,
			email,
			username,
		},
	};
};

const SESSION_LIFETIME = ms(process.env.SESSION_LIFETIME ?? '24h');

export const openUserSession = async (userId: number): Promise<number> => {
	const sessionId = generateSessionId(userId);
	const antiCsrfToken = generateAntiCsrf(userId);

	const {
		rows: [createdSession],
	} = await db.query(
		`
        INSERT INTO
            user_sessions (
                id,
                anti_csrf_token,
                user_id,
                expires_at
            )
        VALUES (
            $1,
            $2,
            $3,
            $4
        )
        RETURNING   
            id
    `,
		[sessionId, antiCsrfToken, userId, new Date(Date.now() + SESSION_LIFETIME)],
	);

	return createdSession.id;
};

export const revokeSession = async (sessionId: string): Promise<number> => {
	const { rowCount } = await db.query(
		` 
        DELETE FROM
            user_sessions
        WHERE
            id = $1
    `,
		[sessionId],
	);

	return rowCount;
};

export const revokeUserSessions = async (userId: number): Promise<number> => {
	const { rowCount } = await db.query(
		`
        DELETE FROM
            user_sessions
        WHERE
            user_id = $1 
    `,
		[userId],
	);

	return rowCount;
};
