import { CourseAggregate } from '../domain/course.ag';
import { CourseDescription, CourseName, CourseStudentCountRange } from '../domain/course.vo';
import type { ICourseUnitOfWork } from '../domain/i-course.uow';

export class CourseCommandService {
	private _uow: ICourseUnitOfWork;

	constructor(courseUnitOfWork: ICourseUnitOfWork) {
		this._uow = courseUnitOfWork;
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

	
}
