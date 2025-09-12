import type { CourseAggregate } from '../domain/course.ag';
import type { ICourseQueryRepository } from '../domain/i-course.qr';

export class MockCourseQueryRepository implements ICourseQueryRepository {
	private _data: Map<string, CourseAggregate>;
	constructor(data: Map<string, CourseAggregate>) {
		this._data = data;
	}
	public async findById(id: string): Promise<CourseAggregate | null> {
		return this._data.get(id) ?? null;
	}
	public async list(): Promise<CourseAggregate[]> {
		return Array.from(this._data.values());
	}
	public async findOne(): Promise<CourseAggregate | null> {
		return this._data.values().next().value ?? null;
	}
}
