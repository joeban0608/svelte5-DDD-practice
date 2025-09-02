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

	async cancelCourse(id: string) {
		const found = await this._repo.findById(id);
		if (!found) throw new Error('Course not found');
		const ag = CourseAggregate.from(found.props);
		const updated = CourseAggregate.cancel(ag.props);
		await this._repo.saveCourse(updated);
		return {
			id: updated.props.id.value
		};
	}

	async startCourse(id: string) {
		const found = await this._repo.findById(id);
		if (!found) throw new Error('Course not found');
		const ag = CourseAggregate.from(found.props);
		const updated = CourseAggregate.start(ag.props);
		await this._repo.saveCourse(updated);
		return {
			id: updated.props.id.value
		};
	}
}
