import { CourseAggregate } from '../domain/course.ag';

import type { ICourseRepositoryQuery } from '../domain/i-course.repo.query';

export class CourseUseCaseQuery {
	constructor(private readonly _repo: ICourseRepositoryQuery) {}

	async getCourse(id: string): Promise<CourseAggregate | null> {
		return await this._repo.findById(id);
	}

	async listCourses(): Promise<CourseAggregate[]> {
		return await this._repo.list();
	}
}
