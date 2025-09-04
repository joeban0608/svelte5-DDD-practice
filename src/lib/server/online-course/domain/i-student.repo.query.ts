import type { StudentAggregate } from "./student.ag";

export interface IStudentRepositoryQuery {
	findById(id: string): Promise<StudentAggregate | null>;
	list(): Promise<StudentAggregate[]>;
}
