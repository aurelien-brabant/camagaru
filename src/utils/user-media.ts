import { existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";
import { USER_IMAGE_PATH } from "../constant/superposable-picture";
import { User } from "../database/entity/user.entity";

export const getUserMediaIds = (user: User) => {
    const userMediaDirectoryPath = join(USER_IMAGE_PATH, String(user.id));

    if (!existsSync(userMediaDirectoryPath)) {
        mkdirSync(userMediaDirectoryPath);
    }

    return readdirSync(userMediaDirectoryPath).map((filename) => filename.split('.').slice(0, -1).join(''))
}