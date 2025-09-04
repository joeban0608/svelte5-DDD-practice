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

	async startCourse(id: string): Promise<{ id: string }> {
		const found = await this._repo.findById(id);
		if (!found) throw new Error('Course not found');
		const ag = CourseAggregate.from(found.props);
		ag.start();
		await this._repo.save(ag);
		return {
			id: ag.props.id.value
		};
	}

	async cancelCourse(id: string): Promise<{ id: string }> {
		const found = await this._repo.findById(id);
		if (!found) throw new Error('Course not found');
		const ag = CourseAggregate.from(found.props);
		ag.cancel();
		await this._repo.save(ag);
		return {
			id: ag.props.id.value
		};
	}
}
