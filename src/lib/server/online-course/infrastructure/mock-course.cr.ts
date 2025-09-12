import type { CourseAggregate } from '../domain/course.ag';
import type { ICourseCommandRepository } from '../domain/i-course.cr';

export class MockCourseCommandRepository implements ICourseCommandRepository {
	private _data: Map<string, CourseAggregate>;

	constructor(data: Map<string, CourseAggregate>) {
		this._data = data;
	}

	public async save(course: CourseAggregate): Promise<void> {
		this._data.set(course.id.value, course);
	}

	public async findById(id: string): Promise<CourseAggregate | null> {
		return this._data.get(id) ?? null;
	}

	public async findByName(name: string): Promise<CourseAggregate | null> {
		for (const course of this._data.values()) {
			if (course.name.value === name) {
				return course;
			}
		}
		return null;
	}

	public async delete(id: string): Promise<void> {
		this._data.delete(id);
	}
}
