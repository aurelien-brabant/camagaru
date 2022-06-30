import { Column } from 'typeorm';

export class ExpirableEntity {
	@Column({
		type: 'timestamptz',
		default: 'NOW()',
	})
	createdAt: Date;

	@Column({
		type: 'timestamptz',
	})
	expiresAt: Date;
}
