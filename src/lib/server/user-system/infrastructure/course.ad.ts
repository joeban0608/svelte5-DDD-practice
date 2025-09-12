import type { ICourseAntiCorruptionLayerAdapter } from '../domain/i-course.acl.ad';

export class CourseAdapter implements ICourseAntiCorruptionLayerAdapter {
	async roleToPermission(roleTypes: string): Promise<string> {
		switch (roleTypes) {
			case 'student':
				return 'course:student';
			case 'teacher':
				return 'course:teacher';
			case 'admin':
				return 'course:admin';
			default:
				throw new Error('Unknown role type');
		}
	}
}
