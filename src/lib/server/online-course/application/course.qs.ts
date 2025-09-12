import type { ICourseUnitOfWork } from '../domain/i-course.uow';

export class CourseQueryService {
	private _uow: ICourseUnitOfWork;

	constructor(courseUnitOfWork: ICourseUnitOfWork) {
		this._uow = courseUnitOfWork;
	}

	public async getCourse(id: string) {
		return this._uow.courseQueryRepository.findById(id);
	}

	public async listCourses() {
		return this._uow.courseQueryRepository.list();
	}

	public async getOneCourse() {
		return this._uow.courseQueryRepository.findOne();
	}
}
