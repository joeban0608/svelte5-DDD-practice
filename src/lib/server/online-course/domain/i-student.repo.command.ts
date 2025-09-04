import type { StudentAggregate } from './student.ag';

export interface IStudentRepositoryCommand {
	findById(id: string): Promise<StudentAggregate | null>;
	delete(id: string): Promise<void>;
	save(student: StudentAggregate): Promise<void>;
}
