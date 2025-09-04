import type { IStudentRepositoryQuery } from '../domain/i-student.repo.query';
import type { StudentAggregate } from '../domain/student.ag';

export class MockStudentRepoQuery implements IStudentRepositoryQuery {
	constructor(private students: Map<string, StudentAggregate>) {}

	async findById(id: string): Promise<StudentAggregate | null> {
		return this.students.get(id) || null;
	}

	async list(): Promise<StudentAggregate[]> {
		return Array.from(this.students.values());
	}

	async findFirst(): Promise<StudentAggregate | null> {
		const firstStudent = this.students.values().next().value;
		return firstStudent ?? null;
	}
}
