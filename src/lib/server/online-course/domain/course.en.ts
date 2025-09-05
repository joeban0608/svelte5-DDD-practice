import { CreatedAt } from '$lib/server/_share/domain/share.vo';
import { CourseDescription, CourseId, CourseName, CourseStudentCountRange } from './course.vo';
import type { StudentEntity } from './student.en';

export type CourseProps = {
	id: CourseId;
	createdAt: CreatedAt;
	name: CourseName;
	description: CourseDescription;
	studentCountRange: CourseStudentCountRange;
};

export class CourseEntity {
	public readonly id: CourseId;
	public readonly createdAt: CreatedAt;
	private _name: CourseName;
	private _description: CourseDescription;
	private _studentCountRange: CourseStudentCountRange;

	private _students: StudentEntity[];
	public readonly studentCount: number;

	get name() {
		return this._name;
	}

	get description() {
		return this._description;
	}

	get studentCountRange() {
		return this._studentCountRange;
	}

	get students() {
		return this._students;
	}

	private constructor(props: CourseProps, students: StudentEntity[]) {
		this.id = props.id;
		this.createdAt = props.createdAt;
		this._name = props.name;
		this._description = props.description;
		this._studentCountRange = props.studentCountRange;

		this._students = students;
		this.studentCount = students.length;
	}

	public static create(props: Omit<CourseProps, 'id' | 'createdAt'>): CourseEntity {
		return new CourseEntity(
			{
				...props,
				id: CourseId.create(crypto.randomUUID()),
				createdAt: CreatedAt.create(Date.now())
			},
			[]
		);
	}

	public static from(primitive: CourseProps, students: StudentEntity[]): CourseEntity {
		return new CourseEntity(primitive, students);
	}
}
