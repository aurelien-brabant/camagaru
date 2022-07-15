CREATE TABLE IF NOT EXISTS  users (
    id          SERIAL          PRIMARY KEY,
    email       VARCHAR(255)    UNIQUE NOT NULL,
    username    VARCHAR(50)     UNIQUE NOT NULL,
    password    VARCHAR(255)    NOT NULL
);

CREATE TABLE IF NOT EXISTS  user_sessions (
    id              VARCHAR(255)    PRIMARY KEY,
    anti_csrf_token VARCHAR(255)    NOT NULL, 
    user_id         INT             NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at      TIMESTAMPTZ     NOT NULL,

    CONSTRAINT
        fk_user_id
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS  account_validation_tokens (
    id              VARCHAR(255)    PRIMARY KEY,
    user_id         INT             NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at      TIMESTAMPTZ     NOT NULL,

    CONSTRAINT
        fk_user_id
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS	pictures (
	id				VARCHAR(255)	PRIMARY KEY,
	owner_id		INT				NOT NULL,
	created_at		TIMESTAMPTZ		NOT NULL DEFAULT CURRENT_TIMESTAMP,
	like_count		INT				NOT NULL DEFAULT 0,

	CONSTRAINT
		fk_owner_id
	FOREIGN KEY (owner_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS	picture_comments (
	id				SERIAL			PRIMARY KEY,
	picture_id		VARCHAR(255)	NOT NULL,
	author_id		INT				NOT NULL,
	content			VARCHAR(500)	NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT
		fk_author_id
	FOREIGN KEY (author_id) REFERENCES users (id),

	CONSTRAINT
		fk_picture_id
	FOREIGN KEY (picture_id) REFERENCES pictures (id)
);

CREATE TABLE IF NOT EXISTS  picture_likes (
    id              SERIAL          PRIMARY KEY,
    picture_id      VARCHAR(255)    NOT NULL,
    user_id         INT             NOT NULL,

    CONSTRAINT
        fk_user_id
    FOREIGN KEY (user_id) REFERENCES users (id),

	CONSTRAINT
		fk_picture_id
	FOREIGN KEY (picture_id) REFERENCES pictures (id)
)