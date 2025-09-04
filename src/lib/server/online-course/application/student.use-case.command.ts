import type { IStudentRepositoryCommand } from '../domain/i-student.repo.command';
import { StudentAggregate, type StudentProps } from '../domain/student.ag';

export class StudentUseCaseCommand {
	constructor(private _repo: IStudentRepositoryCommand) {}

	async createStudent(input: Omit<StudentProps, 'id' | 'createdAt'>): Promise<{ id: string }> {
		const ag = StudentAggregate.create(input);
		await this._repo.save(ag);
		return {
			id: ag.props.id.value
		};
	}

	async deleteStudent(id: string): Promise<{ id: string }> {
		const found = await this._repo.findById(id);
		if (!found) throw new Error('Student not found');
		const ag = StudentAggregate.from(found.props);
		await this._repo.delete(ag.props.id.value);
		return {
			id: ag.props.id.value
		};
	}
}
