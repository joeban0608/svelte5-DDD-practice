import type { IUserCommandRepository } from '../domain/i-user.cr';
import type { UserAggregate } from '../domain/user.ag';

export class MockUserCommandRepository implements IUserCommandRepository {
	private _data: Map<string, UserAggregate>;
	constructor(data: Map<string, UserAggregate>) {
		this._data = data;
	}

	public async save(user: UserAggregate): Promise<void> {
		this._data.set(user.id.value, user);
	}

	public async findById(id: string): Promise<UserAggregate | null> {
		return this._data.get(id) ?? null;
	}

	public async findByEmail(email: string): Promise<UserAggregate | null> {
		for (const user of this._data.values()) {
			if (user.email.value === email) {
				return user;
			}
		}
		return null;
	}

	public async delete(id: string): Promise<void> {
		this._data.delete(id);
	}
}
