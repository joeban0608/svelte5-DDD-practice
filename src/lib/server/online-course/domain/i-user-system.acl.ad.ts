import type { MemberRoleType } from "./member.vo";

export interface IUserSystemAntiCorruptionLayerAdapter {
	permissionsToRoles(permissions: string[]): MemberRoleType[];
}
