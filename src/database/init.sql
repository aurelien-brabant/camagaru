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