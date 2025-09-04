import { CourseAggregate, type CourseProps } from '../domain/course.ag';

import type { ICourseRepositoryCommand } from '../domain/i-course.repo.command';

export class CourseUseCaseCommand {
	constructor(private readonly _repo: ICourseRepositoryCommand) {}

	async createCourse(input: Omit<CourseProps, 'id' | 'createdAt'>): Promise<{ id: string }> {
		const ag = CourseAggregate.create(input);
		await this._repo.save(ag);
		return {
			id: ag.props.id.value
		};
	}

	async deleteCourse(id: string): Promise<{ id: string }> {
		const found = await this._repo.findById(id);
		if (!found) throw new Error('Course not found');
		const ag = CourseAggregate.from(found.props);
		await this._repo.delete(ag.props.id.value);
		return {
			id: ag.props.id.value
		};
	}

	async updateCourseField(
		id: string,
		patch: Partial<Omit<CourseProps, 'id' | 'createdAt'>>
	): Promise<{ id: string }> {
		const found = await this._repo.findById(id);
		if (!found) throw new Error('Course not found');
		// 用新的 CourseAggregate 或 merge 欄位
		const updateCourseProps = { ...found.props, ...patch };
		const updatedCourse = CourseAggregate.from(updateCourseProps);
		await this._repo.save(updatedCourse);
		return {
			id: updatedCourse.props.id.value
		};
	}
}
