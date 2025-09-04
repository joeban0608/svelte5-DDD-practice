import { CreatedAt } from '$lib/server/_shard/shard.vo';
import { CourseId } from './course.vo';
import { EnrollmentId } from './enrollment.vo';
import { StudentId } from './student.vo';

export type EnrollmentProps = {
	id: EnrollmentId;
	courseId: CourseId;
	studentId: StudentId;
	createAt: CreatedAt;
};

export class EnrollmentEntity {
	private constructor(public readonly props: EnrollmentProps) {}
	public static create(props: Omit<EnrollmentProps, 'id' | 'createAt'>): EnrollmentEntity {
		return new EnrollmentEntity({
			...props,
			id: EnrollmentId.create(crypto.randomUUID()),
			createAt: CreatedAt.create(Date.now())
		});
	}

	public static from(primitive: EnrollmentProps): EnrollmentEntity {
		return new EnrollmentEntity(primitive);
	}
}
