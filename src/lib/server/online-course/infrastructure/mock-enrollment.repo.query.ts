import type { EnrollmentEntity } from '../domain/enrollment.en';
import type { IEnrollmentRepositoryQuery } from '../domain/i-enrollment.repo.query';

export class MockEnrollmentRepositoryQuery implements IEnrollmentRepositoryQuery {
	constructor(private readonly _repo: Map<string, EnrollmentEntity>) {}

	async findById(id: string): Promise<EnrollmentEntity | null> {
		return this._repo.get(id) || null;
	}

	async list(): Promise<EnrollmentEntity[]> {
		return Array.from(this._repo.values());
	}

	async countById(id: string): Promise<number> {
		return Array.from(this._repo.values()).filter(
			(enrollment) => enrollment.props.courseId.value === id
		).length;
	}

	async isExist(studentId: string, courseId: string): Promise<boolean> {
		return Array.from(this._repo.values()).some(
			(enrollment) =>
				enrollment.props.studentId.value === studentId &&
				enrollment.props.courseId.value === courseId
		);
	}
}
