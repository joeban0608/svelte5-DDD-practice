import type { IUserQueryRepository } from '../domain/i-user.qr';
import type { UserAggregate } from '../domain/user.ag';

export class MockUserQueryRepository implements IUserQueryRepository {
	private _data: Map<string, UserAggregate>;
	constructor(data: Map<string, UserAggregate>) {
		this._data = data;
	}

	public async findById(id: string): Promise<UserAggregate | null> {
		return this._data.get(id) ?? null;
	}
	public async list(): Promise<UserAggregate[]> {
		return Array.from(this._data.values());
	}
	public async findOne(): Promise<UserAggregate | null> {
		return this._data.values().next().value ?? null;
	}
}
