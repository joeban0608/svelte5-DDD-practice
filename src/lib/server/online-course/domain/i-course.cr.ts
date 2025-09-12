import type { CourseAggregate } from './course.ag';

export interface ICourseCommandRepository {
	save(course: CourseAggregate): Promise<void>;
	findById(id: string): Promise<CourseAggregate | null>;
	findByName(name: string): Promise<CourseAggregate | null>;
	delete(id: string): Promise<void>;
}
