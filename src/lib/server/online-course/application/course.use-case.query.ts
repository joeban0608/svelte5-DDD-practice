import type { ICourseRepositoryQuery } from '../domain/i-course.repo.query';

/**
 * CourseUseCaseQuery
 * 可以直接從 repo 拿出來直接用, 因為沒有要改變 state
 * 通常會在擴充與實作 pagination, filter
 */
export class CourseUseCaseQuery {
	constructor(private readonly _repo: ICourseRepositoryQuery) {}

	async getCourse(id: string) {
		return await this._repo.findCourse(id);
	}

	async listCourses() {
		return await this._repo.listCourses();
	}
}
