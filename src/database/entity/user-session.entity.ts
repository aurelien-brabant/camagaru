import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../entity/user.entity';

@Entity()
export class UserSession {
	@PrimaryGeneratedColumn()
	id: string;

	@ManyToOne(() => User, (user) => user.sessions)
	user: User;
}
