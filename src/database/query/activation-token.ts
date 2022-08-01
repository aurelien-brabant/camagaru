import ms from 'ms';
import { db } from '../connection';
import { v4 as uuidv4 } from 'uuid';

export type AccountValidationToken = {
	id: string;
	userId: number;
	createdAt: Date;
	expiresAt: Date;
}

export const getPendingActivationTokenById = async (tokenId: string): Promise<AccountValidationToken | null> => {
	const { rows } = await db.query(`
		SELECT
			id,
			user_id,
			created_at,
			expires_at
		FROM
			account_validation_tokens
		WHERE
			id = $1
		AND
			expires_at > CURRENT_TIMESTAMP
	`, [tokenId]);
	const row = rows[0];

	if (typeof row === 'undefined') {
		return null;
	}

	return {
		id: row.id,
		userId: row.user_id,
		createdAt: row.created_at,
		expiresAt: row.expires_at
	}
}

export const createActivationToken = async (userId: number, lifetime: number) => {
	const expiresAt = new Date(Date.now() + ms(lifetime));
	const tokenId = uuidv4();

	await db.query(`
		INSERT INTO
			account_validation_tokens (
				id,
				user_id,
				expires_at
			)
			VALUES (
				$1,
				$2,
				$3
			)
	`, [tokenId, userId, expiresAt]);

	return tokenId;
}

export const revokeActivationTokenById = async (tokenId: string) => {
	await db.query(`
		DELETE FROM
			account_validation_tokens
		WHERE
			id = $1
	`, [tokenId]);
}

export const revokeUserActivationTokens = async (userId: number) => {
	await db.query(`
		DELETE FROM
			account_validation_tokens
		WHERE
			user_id = $1
	`, [userId]);
}
