import type { MemberRoleType } from '$lib/server/online-course/domain/member.vo';

export interface IOnlineCourseAntiCorruptionLayerAdapter {
	roleToPermission(role: MemberRoleType): string;
}
