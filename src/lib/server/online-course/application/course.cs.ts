import { CourseAggregate } from '../domain/course.ag';
import { CourseDescription, CourseName, CourseStudentCountRange } from '../domain/course.vo';
import type { ICourseUnitOfWork } from '../domain/i-course.uow';
import type { IUserSystemAntiCorruptionLayerAdapter } from '../domain/i-user-system.acl.ad';

export class CourseCommandService {
	private _uow: ICourseUnitOfWork;
	private _userSystemAclAdapter: IUserSystemAntiCorruptionLayerAdapter;

	constructor(
		courseUnitOfWork: ICourseUnitOfWork,
		userSystemAclAdapter: IUserSystemAntiCorruptionLayerAdapter
	) {
		this._uow = courseUnitOfWork;
		this._userSystemAclAdapter = userSystemAclAdapter;
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
		userId
	}: {
		courseId: string;
		userId: string;
	}): Promise<void> {
		return this._uow.execute(async (repo) => {
			const course = await repo.findById(courseId);
			if (!course) {
				throw new Error('Course not found');
			}
			const roles = await this._userSystemAclAdapter.permissionsToRoles(userId);

			await course.addMember({ userId, roles });
			await repo.save(course);
		});
	}
}
