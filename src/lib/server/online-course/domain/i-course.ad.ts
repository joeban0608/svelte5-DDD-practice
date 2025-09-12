import type { MemberRoleType } from '../infrastructure/course.ad';

export interface ICourseAdapter {
	roleToPermission(role: MemberRoleType): string;
	permissionsToRole(permissions: string[]): MemberRoleType[];
}
