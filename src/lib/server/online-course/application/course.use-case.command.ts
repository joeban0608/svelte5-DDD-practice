import { CourseAggregate, type CourseProps } from '../domain/course.ag';
import type { ICourseRepositoryCommand } from '../domain/i-course.repo.command';

/**
 * CourseCommandUseCase
 * 應該遵循 repo > ag > ag.operation > repo 流程
 */
export class CourseUseCaseCommand {
	constructor(private readonly _repo: ICourseRepositoryCommand) {}

	async createCourse(input: Omit<CourseProps, 'id' | 'createdAt'>) {
		const ag = CourseAggregate.create(input);
		await this._repo.saveCourse(ag);
		return {
			id: ag.props.id.value
		};
	}

	async deleteCourse(id: string) {
		const found = await this._repo.findById(id);
		if (!found) throw new Error('Course not found');
		const ag = CourseAggregate.from(found.props);
		await this._repo.deleteCourse(ag.props.id.value);
		return {
			id: ag.props.id.value
		};
	}

	async updateCourseField(id: string, patch: Partial<Omit<CourseProps, 'id' | 'createdAt'>>) {
		const found = await this._repo.findById(id);
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
