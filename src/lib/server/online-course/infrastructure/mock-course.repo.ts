import type { CourseAggregate } from '../domain/course.ag';
import type { ICourseRepository } from '../domain/i-course.repo';

export class MockCourseRepo implements ICourseRepository {
	constructor(private courses: Map<string, CourseAggregate>) {}

	async saveCourse(course: CourseAggregate): Promise<void> {
		this.courses.set(course.props.id.value, course);
	}

	async findCourse(id: string): Promise<CourseAggregate | null> {
		return this.courses.get(id) ?? null;
	}

	async listCourses(): Promise<CourseAggregate[]> {
		return Array.from(this.courses.values());
	}

	async deleteCourse(id: string): Promise<void> {
		this.courses.delete(id);
	}
}
