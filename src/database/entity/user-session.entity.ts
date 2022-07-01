import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

import { ExpirableEntity } from '../../utils/expirable-entity';
import { User } from '../entity/user.entity';

@Entity()
export class UserSession {
	@PrimaryColumn()
	id: string;

	@Column()
	antiCSRF: string;

	@ManyToOne(() => User, (user) => user.sessions)
	user: User;
}
