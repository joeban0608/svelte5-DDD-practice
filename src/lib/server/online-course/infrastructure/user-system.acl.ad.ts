import type { IUserSystemAntiCorruptionLayerAdapter } from '../domain/i-user-system.acl.ad';
import type { MemberRoleType } from '../domain/member.vo';

export class UserSystemAntiCorruptionLayerAdapter implements IUserSystemAntiCorruptionLayerAdapter {
	permissionsToRoles(permissions: string[]): MemberRoleType[] {
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
