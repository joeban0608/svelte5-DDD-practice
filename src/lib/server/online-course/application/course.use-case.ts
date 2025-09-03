import { CourseAggregate, type CourseProps } from '../domain/course.ag';

import type { ICourseRepository } from '../domain/i-course.repo';

export class CourseUseCase {
	constructor(private readonly _repo: ICourseRepository) {}

	async getCourse(id: string) {
		return this._repo.findCourse(id);
	}

	async listCourses() {
		return this._repo.listCourses();
	}

	async createCourse(input: Omit<CourseProps, 'id' | 'createdAt'>) {
		const course = CourseAggregate.create(input);
		await this._repo.saveCourse(course);
		return course;
	}

	async deleteCourse(id: string) {
		await this._repo.deleteCourse(id);
		return id;
	}

	async updateCourseField(id: string, patch: Partial<Omit<CourseProps, 'id' | 'createdAt'>>) {
		const found = await this._repo.findCourse(id);
		if (!found) throw new Error('Course not found');
		// 用新的 CourseAggregate 或 merge 欄位
		const updateCourseProps = { ...found.props, ...patch };
		const updatedCourse = CourseAggregate.from(updateCourseProps);
		await this._repo.saveCourse(updatedCourse);
		return updatedCourse;
	}
}
