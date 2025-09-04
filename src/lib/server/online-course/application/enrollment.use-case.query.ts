import type { EnrollmentEntity } from '../domain/enrollment.en';
import type { IEnrollmentRepositoryQuery } from '../domain/i-enrollment.repo.query';

export class EnrollmentUseCaseQuery {
	constructor(private readonly EnrollmentRepoQuery: IEnrollmentRepositoryQuery) {}

	public async getEnrollment(id: string): Promise<EnrollmentEntity | null> {
		return await this.EnrollmentRepoQuery.findById(id);
	}
	public async listEnrollments(): Promise<EnrollmentEntity[]> {
		return await this.EnrollmentRepoQuery.list();
	}
}
