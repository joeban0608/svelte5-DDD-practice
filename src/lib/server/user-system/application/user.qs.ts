import type { IUserUnitOfWork } from '../domain/i-user.uow';

export class MockUserQueryService {
	private _uow: IUserUnitOfWork;

	constructor(userUnitOfWork: IUserUnitOfWork) {
		this._uow = userUnitOfWork;
	}

	public async getUser(id: string) {
		return this._uow.userQueryRepository.findById(id);
	}

	public async listUsers() {
		return this._uow.userQueryRepository.list();
	}
}
