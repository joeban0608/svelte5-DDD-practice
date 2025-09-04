import { StudentEmail, StudentId, StudentName } from './student.vo';

export type StudentProps = {
	id: StudentId;
	name: StudentName;
	email: StudentEmail;
};

export class StudentAggregate {
	private constructor(public readonly props: StudentProps) {}

	public static create(props: Omit<StudentProps, 'id'>): StudentAggregate {
		return new StudentAggregate({
			...props,
			id: StudentId.create(crypto.randomUUID())
		});
	}

	public static from(primitive: StudentProps): StudentAggregate {
		return new StudentAggregate(primitive);
	}
}
