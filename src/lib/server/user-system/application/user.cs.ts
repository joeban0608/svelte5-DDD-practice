import type { MemberRoleType } from '$lib/server/online-course/domain/member.vo';
import type { ICourseAntiCorruptionLayerAdapter } from '../domain/i-course.acl.ad';
import type { IUserUnitOfWork } from '../domain/i-user.uow';
import { UserAggregate } from '../domain/user.ag';
import { UserEmail, UserName, UserPermission } from '../domain/user.vo';

export class UserCommandService {
	private readonly _uow: IUserUnitOfWork;
	private readonly _courseAclAdapter: ICourseAntiCorruptionLayerAdapter;

	constructor(
		userUnitOfWork: IUserUnitOfWork,
		courseAclAdapter: ICourseAntiCorruptionLayerAdapter
	) {
		this._uow = userUnitOfWork;
		this._courseAclAdapter = courseAclAdapter;
	}

	public async registerUser({
		name,
		email,
		password,
		role
	}: {
		name: string;
		email: string;
		password: string;
		role: MemberRoleType;
	}): Promise<{ id: string }> {
		return this._uow.execute(async (repo) => {
			const existingUser = await repo.findByEmail(email);
			if (existingUser) {
				throw new Error('User already exists');
			}
			if (!role) {
				throw new Error('Role is required');
			}
			const permission = await this._courseAclAdapter.roleToPermission(role);

			const newUser = await UserAggregate.create(
				{
					name: UserName.create(name),
					email: UserEmail.create(email),
					permissions: [UserPermission.create(permission)]
				},
				password
			);

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
