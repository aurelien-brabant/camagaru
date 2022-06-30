import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { AccountValidationToken } from './account-validation-token.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		length: 255,
	})
	email: string;

	@Column({
		length: 50,
	})
	username: string;

	@Column({
		select: false,
	})
	password: string;

	@OneToMany(() => AccountValidationToken, (token) => token.validatedUser)
	accountValidationTokens: AccountValidationToken[];
}
