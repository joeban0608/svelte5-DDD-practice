import type { IUserCommandRepository } from './i-user.cr';
import type { IUserQueryRepository } from './i-user.qr';

export interface IUserUnitOfWork {
	readonly userQueryRepository: IUserQueryRepository;
	execute<T>(fn: (repo: IUserCommandRepository) => Promise<T>): Promise<T>;
}
