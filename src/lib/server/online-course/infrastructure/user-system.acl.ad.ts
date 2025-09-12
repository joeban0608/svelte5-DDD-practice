import type { UserQueryService } from '$lib/server/user-system/application/user.qs';
import type { IUserSystemAntiCorruptionLayerAdapter } from '../domain/i-user-system.acl.ad';
import type { MemberRoleType } from '../domain/member.vo';

export class UserSystemAntiCorruptionLayerAdapter implements IUserSystemAntiCorruptionLayerAdapter {
	constructor(private readonly qsUser: UserQueryService) {}

	public async permissionsToRoles(userId: string): Promise<MemberRoleType[]> {
		const agUser = await this.qsUser.getUser(userId);
		if (!agUser) {
			return [];
		}

		const permissions = agUser.permissions.map((p) => p.value);

		// Implement your logic here
		return permissions
			.map((permission) => {
				switch (permission) {
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
