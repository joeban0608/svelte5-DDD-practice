import type { ICourseAdapter } from '$lib/server/online-course/domain/i-course.ad';
import { type MemberPermissionType } from '$lib/server/online-course/infrastructure/course.ad';
import type { IUserUnitOfWork } from '../domain/i-user.uow';
import { UserAggregate } from '../domain/user.ag';
import { UserEmail, UserName, UserPermission } from '../domain/user.vo';

export class UserCommandService {
	private _uow: IUserUnitOfWork;
	private _courseAdapter: ICourseAdapter;

	constructor(userUnitOfWork: IUserUnitOfWork, courseAdapter: ICourseAdapter) {
		this._uow = userUnitOfWork;
		this._courseAdapter = courseAdapter;
	}

	public async registerUser({
		name,
		email,
		password,
		courseRole
	}: {
		name: string;
		email: string;
		password: string;
		courseRole?: MemberPermissionType;
	}): Promise<{ id: string }> {
		return this._uow.execute(async (repo) => {
			const existingUser = await repo.findByEmail(email);
			if (existingUser) {
				throw new Error('User already exists');
			}

			// 透過 CourseAdapter 轉換角色為權限字串
			const permissions: string[] = [];
			if (courseRole) {
				permissions.push(this._courseAdapter.roleToPermission(courseRole));
			}

			const newUser = await UserAggregate.create({
				name: UserName.create(name),
				email: UserEmail.create(email),
				plainPassword: password,
				permissions: permissions.map((p) => UserPermission.create(p))
			});

			await repo.save(newUser);
			return {
				id: newUser.id.value
			};
		});
	}

	public async changePassword({
		id,
		oldPassword,
		newPassword
	}: {
		id: string;
		oldPassword: string;
		newPassword: string;
	}): Promise<{ id: string }> {
		return this._uow.execute(async (repo) => {
			const user = await repo.findById(id);
			if (!user) {
				throw new Error('User does not exist');
			}
			await user.updatedPassword({
				oldPassword,
				newPassword
			});
			await repo.save(user);
			return {
				id: user.id.value
			};
		});
	}

	public async removeUser(id: string) {
		return this._uow.execute(async (repo) => {
			const existingUser = await repo.findById(id);
			if (!existingUser) {
				throw new Error('User does not exist');
			}
			await repo.delete(id);
		});
	}
}
