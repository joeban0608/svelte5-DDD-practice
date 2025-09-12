import type { IUserCommandRepository } from '../domain/i-user.cr';
import type { IUserQueryRepository } from '../domain/i-user.qr';
import type { IUserUnitOfWork } from '../domain/i-user.uow';
import type { UserAggregate } from '../domain/user.ag';
import { MockUserCommandRepository } from './mock-user.cr';

export class MockUserUnitOfWork implements IUserUnitOfWork {
	private _userQueryRepository: IUserQueryRepository;
	private _userData: Map<string, UserAggregate>;

	constructor(userQueryRepository: IUserQueryRepository, userData: Map<string, UserAggregate>) {
		this._userQueryRepository = userQueryRepository;
		this._userData = userData;
	}
	get userQueryRepository(): IUserQueryRepository {
		return this._userQueryRepository;
	}

	public async execute<T>(fn: (repo: IUserCommandRepository) => Promise<T>): Promise<T> {
		// clone a snapshot for rollback
		const snapshot = structuredClone(this._userData);

		try {
			const result = await fn(new MockUserCommandRepository(this._userData));
			return result;
		} catch (err) {
			// rollback: restore snapshot
			this._userData.clear();
			for (const [k, v] of snapshot.entries()) {
				this._userData.set(k, v);
			}
			throw err;
		}
	}
}
