import type { ICourseAdapter } from '../domain/i-course.ad';

export type MemberRoleType = 'student' | 'teacher' | 'admin';

export class CourseAdapter implements ICourseAdapter {
	roleToPermission(role: MemberRoleType): string {
		return `course:${role}`;
	}
	permissionsToRole(permissions: string[]): MemberRoleType[] {
		const mapping: Record<string, MemberRoleType> = {
			'course:student': 'student',
			'course:teacher': 'teacher',
			'course:admin': 'admin'
		};
		const roles = permissions
			.map((perm) => mapping[perm])
			.filter((role): role is MemberRoleType => role !== undefined);
		return roles;
	}
}
