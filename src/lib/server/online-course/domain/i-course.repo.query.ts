import type { CourseAggregate } from './course.ag';

export interface ICourseRepositoryQuery {
	findCourse(id: string): Promise<CourseAggregate | null>;
	listCourses(): Promise<CourseAggregate[]>;
}
