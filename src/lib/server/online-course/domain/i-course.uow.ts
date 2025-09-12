import type { ICourseCommandRepository } from './i-course.cr';
import type { ICourseQueryRepository } from './i-course.qr';

export interface ICourseUnitOfWork {
	readonly courseQueryRepository: ICourseQueryRepository;
	execute<T>(fn: (repo: ICourseCommandRepository) => Promise<T>): Promise<T>;
}

