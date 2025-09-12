import { UserId } from '$lib/server/user-system/domain/user.vo';
import { CourseAggregate } from '../domain/course.ag';
import { CourseDescription, CourseName, CourseStudentCountRange } from '../domain/course.vo';
import type { ICourseAdapter } from '../domain/i-course.ad';
import type { ICourseUnitOfWork } from '../domain/i-course.uow';
import { MemberRole } from '../domain/member.vo';

export class CourseCommandService {
	private _uow: ICourseUnitOfWork;
	private _courseAdapter: ICourseAdapter;

	constructor(courseUnitOfWork: ICourseUnitOfWork, courseAdapter: ICourseAdapter) {
		this._uow = courseUnitOfWork;
		this._courseAdapter = courseAdapter;
	}

	public async createCourse({
		name,
		description,
		studentCountRange
	}: {
		name: string;
		description: string;
		studentCountRange: { min: number; max: number };
	}): Promise<{ id: string }> {
		return this._uow.execute(async (repo) => {
			const existingCourse = await repo.findByName(name);
			if (existingCourse) {
				throw new Error('Course with the same name already exists');
			}
			const newCourse = await CourseAggregate.create({
				name: CourseName.create(name),
				description: CourseDescription.create(description),
				studentCountRange: CourseStudentCountRange.create(studentCountRange)
			});

			await repo.save(newCourse);
			return {
				id: newCourse.id.value
			};
		});
	}

	public async addStudent({
		courseId,
		studentId,
		permissions
	}: {
		courseId: string;
		studentId: string;
		permissions: string[];
	}): Promise<{ courseId: string; memberId: string }> {
		return this._uow.execute(async (repo) => {
			const course = await repo.findById(courseId);
			if (!course) {
				throw new Error('Course not found');
			}

			const _permissions = this._courseAdapter.permissionsToRole(permissions);
			if (_permissions.length !== 1) {
				throw new Error('Invalid role');
			}

			const addMemberResult = await course.addMember({
				userId: UserId.create(studentId),
				role: MemberRole.create(_permissions[0])
			});

			await repo.save(course);
			return {
				courseId: course.id.value,
				userId: studentId,
				memberId: addMemberResult.memberId
			};
		});
	}
}
