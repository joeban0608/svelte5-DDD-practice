import type { IUserUnitOfWork } from '../domain/i-user.uow';
import { UserAggregate } from '../domain/user.ag';
import { UserEmail, UserHashedPassword, UserName } from '../domain/user.vo';

export class MockUserCommandService {
	private _uow: IUserUnitOfWork;

	constructor(userUnitOfWork: IUserUnitOfWork) {
		this._uow = userUnitOfWork;
	}

	private async hashPassword(password: string): Promise<string> {
		const encoder = new TextEncoder();
		const data = encoder.encode(password);
		const hashBuffer = await crypto.subtle.digest('SHA-256', data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		// 轉成 hex 字串
		return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
	}

	private async verifyPassword(password: string, hashed: string): Promise<boolean> {
		const hashToCompare = await this.hashPassword(password);
		return hashed === hashToCompare;
	}

	public async registerUser(
		name: string,
		email: string,
		password: string
	): Promise<{ id: string }> {
		return this._uow.execute(async (repo) => {
			const existingUser = await repo.findById(email);
			if (existingUser) {
				throw new Error('User already exists');
			}

			// const hashedPassword = await this.hashPassword(password);
			const newUser = UserAggregate.create({
				name: UserName.create(name),
				email: UserEmail.create(email),
				plainPwd: password
			});

			await repo.save(newUser);
			return { id: newUser.id.value };
		});
	}

	public async removeUser(id: string): Promise<{ id: string }> {
		return this._uow.execute(async (repo) => {
			const existingUser = await repo.findById(id);
			if (!existingUser) {
				throw new Error('User does not exist');
			}
			await repo.delete(id);
			return {
				id: existingUser.id.value
			};
		});
	}

	public async changePassword(
		id: string,
		oldPassword: string,
		newPassword: string
	): Promise<{ id: string }> {
		return this._uow.execute(async (repo) => {
			const user = await repo.findById(id);
			if (!user) {
				throw new Error('User does not exist');
			}
			const isOldPasswordValid = await this.verifyPassword(oldPassword, user.hashedPassword.value);
			if (!isOldPasswordValid) {
				throw new Error('Old password is incorrect');
			}
			const newHashedPassword = await this.hashPassword(newPassword);
			user.updateHashedPassword(UserHashedPassword.create(newHashedPassword));
			await repo.save(user);
			return { id: user.id.value };
		});
	}
}
