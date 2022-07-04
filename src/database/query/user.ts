import { hash } from 'bcrypt';

import { db } from '../connection';

const HASH_PASSWORD_SALT_ROUNDS = 10;

export type User = {
	id: number;
	email: string;
	username: string;
};

export const queryUserById = async (userId: number): Promise<User | null> => {
	const {
		rows: [row],
	} = await db.query(
		`
        SELECT
            id,
            email,
            username
        FROM
            users
        WHERE
            id = $1
    `,
		[userId],
	);

	if (!row) {
		return null;
	}

	return row;
};

export const queryUserByEmailWithPassword = async (userId: number): Promise<(User & { password: string }) | null> => {
	const {
		rows: [row],
	} = await db.query(
		`
        SELECT
            id,
            email,
            username,
            password
        FROM
            users
        WHERE
            email = $1
    `,
		[userId],
	);

	if (!row) {
		return null;
	}

	return row;
};

export const insertUser = async ({
	email,
	username,
	password,
}: {
	email: string;
	username: string;
	password: string;
}): Promise<User> => {
	const hashedPassword = await hash(password, HASH_PASSWORD_SALT_ROUNDS);

	const {
		rows: [row],
	} = await db.query(
		`
        INSERT INTO
            users (
                email,
                username,
                password
            )
        VALUES (
            $1,
            $2,
            $3
        )
        RETURNING
            id,
            email,
            username
    `,
		[email, username, hashedPassword],
	);

	return row;
};
