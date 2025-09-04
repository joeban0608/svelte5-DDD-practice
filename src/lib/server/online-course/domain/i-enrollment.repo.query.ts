import type { EnrollmentEntity } from './enrollment.en';

export interface IEnrollmentRepositoryQuery {
	findById(id: string): Promise<EnrollmentEntity | null>;
	list(): Promise<EnrollmentEntity[]>;
	countById(courseId: string): Promise<number>;
	isExist(studentId: string, courseId: string): Promise<boolean>;
}
