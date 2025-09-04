import type { CourseAggregate } from '../domain/course.ag';
import type { ICourseRepositoryCommand } from '../domain/i-course.repo.command';

export class MockCourseRepoCommand implements ICourseRepositoryCommand {
	constructor(private courses: Map<string, CourseAggregate>) {}

	async save(course: CourseAggregate): Promise<void> {
		this.courses.set(course.props.id.value, course);
	}

	async findById(id: string): Promise<CourseAggregate | null> {
		return this.courses.get(id) ?? null;
	}

	async delete(id: string): Promise<void> {
		this.courses.delete(id);
	}
}
