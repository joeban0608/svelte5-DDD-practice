import type { MemberRoleType } from './member.vo';

export interface IUserSystemAntiCorruptionLayerAdapter {
	permissionsToRoles(userId: string): Promise<MemberRoleType[]>;
}
