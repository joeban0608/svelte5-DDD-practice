import { CreatedAt } from '$lib/server/_share/domain/share.vo';
import { StudentId, StudentName, StudentEmail } from './student.vo';

export type StudentProps = {
	id: StudentId;
	createdAt: CreatedAt;
	name: StudentName;
	email: StudentEmail;
};

export class StudentEntity {
	public readonly id: StudentId;
	public readonly createdAt: CreatedAt;
	private _name: StudentName;
	private _email: StudentEmail;

	get name() {
		return this._name;
	}

	get email() {
		return this._email;
	}

	private constructor(props: StudentProps) {
		this.id = props.id;
		this.createdAt = props.createdAt;
		this._name = props.name;
		this._email = props.email;
	}
	
	public static create(props: Omit<StudentProps, 'id' | 'createdAt'>): StudentEntity {
		return new StudentEntity({
			...props,
			id: StudentId.create(crypto.randomUUID()),
			createdAt: CreatedAt.create(Date.now())
		});
	}
	public static from(primitive: StudentProps): StudentEntity {
		return new StudentEntity(primitive);
	}
}
