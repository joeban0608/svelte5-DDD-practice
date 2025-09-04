import type { IStudentRepositoryCommand } from '../domain/i-student.repo.command';
import type { StudentAggregate } from '../domain/student.ag';

export class MockStudentRepoCommand implements IStudentRepositoryCommand {
	constructor(private students: Map<string, StudentAggregate>) {}

	async save(student: StudentAggregate): Promise<void> {
		this.students.set(student.props.id.value, student);
	}
	async findById(id: string): Promise<StudentAggregate | null> {
		return this.students.get(id) ?? null;
	}
	async delete(id: string): Promise<void> {
		this.students.delete(id);
	}
}
