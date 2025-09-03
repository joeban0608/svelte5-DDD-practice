import type { CourseAggregate } from './course.ag';

export interface ICourseRepositoryCommand {
	findById(id: string): Promise<CourseAggregate | null>;
	delete(id: string): Promise<void>;
	save(course: CourseAggregate): Promise<void>;
}
