import type { CourseAggregate } from '../domain/course.ag';
import type { ICourseRepositoryQuery } from '../domain/i-course.repo.query';

export class MockCourseRepoQuery implements ICourseRepositoryQuery {
	constructor(private courses: Map<string, CourseAggregate>) {}

	async findById(id: string): Promise<CourseAggregate | null> {
		return this.courses.get(id) ?? null;
	}

	async list(): Promise<CourseAggregate[]> {
		return Array.from(this.courses.values());
	}
}
