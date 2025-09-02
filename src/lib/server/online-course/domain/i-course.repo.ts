import type { CourseAggregate } from './course.ag';

export interface ICourseRepository {
	saveCourse(course: CourseAggregate): Promise<void>;
	findCourse(id: string): Promise<CourseAggregate | null>;
	listCourses(): Promise<CourseAggregate[]>;
	deleteCourse(id: string): Promise<void>;
}
