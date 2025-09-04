import { CreatedAt } from '$lib/server/_shard/shard.vo';
import { StudentEmail, StudentId, StudentName } from './student.vo';

export type StudentProps = {
	id: StudentId;
	name: StudentName;
	email: StudentEmail;
	createdAt: CreatedAt;
};

export class StudentAggregate {
	private constructor(public readonly props: StudentProps) {}

	public static create(props: Omit<StudentProps, 'id' | 'createdAt'>): StudentAggregate {
		return new StudentAggregate({
			...props,
			id: StudentId.create(crypto.randomUUID()),
			createdAt: CreatedAt.create(Date.now())
		});
	}

	public static from(primitive: StudentProps): StudentAggregate {
		return new StudentAggregate(primitive);
	}
}
