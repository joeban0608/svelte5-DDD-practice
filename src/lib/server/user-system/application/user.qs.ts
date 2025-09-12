import type { IUserUnitOfWork } from '../domain/i-user.uow';

export class UserQueryService {
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

	public async getOneUser() {
		return this._uow.userQueryRepository.findOne();
	}
}
