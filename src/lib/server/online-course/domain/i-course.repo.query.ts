import type { CourseAggregate } from './course.ag';

export interface ICourseRepositoryQuery {
	findById(id: string): Promise<CourseAggregate | null>;
	list(): Promise<CourseAggregate[]>;
	findFirst(): Promise<CourseAggregate | null>;
}
