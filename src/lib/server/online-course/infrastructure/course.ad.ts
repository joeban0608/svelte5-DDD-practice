import type { ICourseAdapter } from '../domain/i-course.ad';

export type MemberPermissionType = 'student' | 'teacher' | 'admin';

export class CourseAdapter implements ICourseAdapter {
	roleToPermission(role: MemberPermissionType): string {
		return `course:${role}`;
	}
}
