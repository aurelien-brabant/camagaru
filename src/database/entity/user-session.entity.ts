import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../entity/user.entity';

@Entity()
export class UserSession {
	@PrimaryGeneratedColumn()
	id: string;

	@Column()
	antiCSRF: string;

	@ManyToOne(() => User, (user) => user.sessions)
	user: User;
}
