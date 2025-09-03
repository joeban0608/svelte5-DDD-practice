import { CourseAggregate, type CourseProps } from '../domain/course.ag';

import type { ICourseRepository } from '../domain/i-course.repo';

export class CourseUseCase {
	constructor(private readonly _repo: ICourseRepository) {}

	async getCourse(id: string): Promise<CourseAggregate | null> {
		const found = await this._repo.findCourse(id);
		if (!found) throw new Error('Course not found');
		const ag = CourseAggregate.from(found.props);
		return ag;
	}

	async listCourses(): Promise<CourseAggregate[]> {
		const foundList = await this._repo.listCourses();
		const agList = foundList.map((course) => CourseAggregate.from(course.props));
		return agList;
	}

	async createCourse(input: Omit<CourseProps, 'id' | 'createdAt'>): Promise<{ id: string }> {
		const ag = CourseAggregate.create(input);
		await this._repo.saveCourse(ag);
		return {
			id: ag.props.id.value
		};
	}

	async deleteCourse(id: string): Promise<{ id: string }> {
		const found = await this._repo.findCourse(id);
		if (!found) throw new Error('Course not found');
		const ag = CourseAggregate.from(found.props);
		await this._repo.deleteCourse(ag.props.id.value);
		return {
			id: ag.props.id.value
		};
	}

	async updateCourseField(
		id: string,
		patch: Partial<Omit<CourseProps, 'id' | 'createdAt'>>
	): Promise<{ id: string }> {
		const found = await this._repo.findCourse(id);
		if (!found) throw new Error('Course not found');
		// 用新的 CourseAggregate 或 merge 欄位
		const updateCourseProps = { ...found.props, ...patch };
		const updatedCourse = CourseAggregate.from(updateCourseProps);
		await this._repo.saveCourse(updatedCourse);
		return {
			id: updatedCourse.props.id.value
		};
	}
}
