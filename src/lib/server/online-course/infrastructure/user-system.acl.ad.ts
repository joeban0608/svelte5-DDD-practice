import type { UserQueryService } from '$lib/server/user-system/application/user.qs';
import type { IUserSystemAntiCorruptionLayerAdapter } from '../domain/i-user-system.acl.ad';
import type { MemberRoleType } from '../domain/member.vo';

export class UserSystemAntiCorruptionLayerAdapter implements IUserSystemAntiCorruptionLayerAdapter {
	private readonly _userQs: UserQueryService;

	constructor(userQs: UserQueryService) {
		this._userQs = userQs;
	}

	async permissionsToRoles(userId: string): Promise<MemberRoleType[]> {
		const user = await this._userQs.getUser(userId);
		if (!user) {
			throw new Error('User not found');
		}
		const permissionAgList = user.permissions;
		// Implement your logic here
		return permissionAgList
			.map((permissionAg) => {
				console.log('permissionAg.value :', permissionAg);
				switch (permissionAg.value) {
					case 'course:student':
						return 'student';
					case 'course:teacher':
						return 'teacher';
					case 'course:admin':
						return 'admin';
					default:
						return null;
				}
			})
			.filter((role) => role !== null);
	}
}
