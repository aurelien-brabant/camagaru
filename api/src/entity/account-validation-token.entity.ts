import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { ExpirableEntity } from '../utils/expirable-entity';
import { User } from './user.entity';

@Entity()
export class AccountValidationToken extends ExpirableEntity {
	@PrimaryColumn({
		default: uuidv4(),
	})
	id: string;

	@ManyToOne(() => User, (user) => user.accountValidationTokens)
	validatedUser: User;
}
