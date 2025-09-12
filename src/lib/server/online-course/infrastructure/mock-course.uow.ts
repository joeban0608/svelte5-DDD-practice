import type { CourseAggregate } from '../domain/course.ag';
import type { ICourseCommandRepository } from '../domain/i-course.cr';
import type { ICourseQueryRepository } from '../domain/i-course.qr';
import type { ICourseUnitOfWork } from '../domain/i-course.uow';
import { MockCourseCommandRepository } from './mock-course.cr';

export class MockCourseUnitOfWork implements ICourseUnitOfWork {
	private _courseQueryRepository: ICourseQueryRepository;
	private _courseData: Map<string, CourseAggregate>;

	constructor(
		courseQueryRepository: ICourseQueryRepository,
		courseData: Map<string, CourseAggregate>
	) {
		this._courseQueryRepository = courseQueryRepository;
		this._courseData = courseData;
	}
	get courseQueryRepository(): ICourseQueryRepository {
		return this._courseQueryRepository;
	}

	public async execute<T>(fn: (repo: ICourseCommandRepository) => Promise<T>): Promise<T> {
		// clone a snapshot for rollback
		const snapshot = structuredClone(this._courseData);

		try {
			const result = await fn(new MockCourseCommandRepository(this._courseData));
			return result;
		} catch (err) {
			// rollback: restore snapshot
			this._courseData.clear();
			for (const [k, v] of snapshot.entries()) {
				this._courseData.set(k, v);
			}
			throw err;
		}
	}
}
