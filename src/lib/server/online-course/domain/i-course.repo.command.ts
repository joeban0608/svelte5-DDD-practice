import type { CourseAggregate } from './course.ag';

export interface ICourseRepositoryCommand {
	saveCourse(course: CourseAggregate): Promise<void>;
	findById(id: string): Promise<CourseAggregate | null>;
	deleteCourse(id: string): Promise<void>;
}
