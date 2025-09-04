import type { IStudentRepositoryQuery } from '../domain/i-student.repo.query';
import type { StudentAggregate } from '../domain/student.ag';

export class StudentUseCaseQuery {
	constructor(private _repo: IStudentRepositoryQuery) {}

	async getStudent(id: string): Promise<StudentAggregate | null> {
		return this._repo.findById(id);
	}

	async listStudents(): Promise<StudentAggregate[]> {
		return this._repo.list();
	}
	async findFirstStudent(): Promise<StudentAggregate | null> {
		return this._repo.findFirst();
	}
}
