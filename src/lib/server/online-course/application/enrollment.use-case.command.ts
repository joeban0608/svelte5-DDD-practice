import { EnrollmentEntity } from '../domain/enrollment.en';
import type { IEnrollmentRepositoryCommand } from '../domain/i-enrollment.repo.command';
import type { IEnrollmentRepositoryQuery } from '../domain/i-enrollment.repo.query';
import type { CourseUseCaseQuery } from './course.use-case.query';
import type { StudentUseCaseQuery } from './student.use-case.query';

export class EnrollmentUseCaseCommand {
	private readonly EnrollmentRepoCommand: IEnrollmentRepositoryCommand;
	private readonly EnrollmentRepoQuery: IEnrollmentRepositoryQuery;
	private readonly StudentUseCaseQuery: StudentUseCaseQuery;
	private readonly CourseUseCaseQuery: CourseUseCaseQuery;
	constructor({
		EnrollmentRepoCommand,
		EnrollmentRepoQuery,
		StudentUseCaseQuery,
		CourseUseCaseQuery
	}: {
		EnrollmentRepoCommand: IEnrollmentRepositoryCommand;
		EnrollmentRepoQuery: IEnrollmentRepositoryQuery;
		StudentUseCaseQuery: StudentUseCaseQuery;
		CourseUseCaseQuery: CourseUseCaseQuery;
	}) {
		this.EnrollmentRepoCommand = EnrollmentRepoCommand;
		this.EnrollmentRepoQuery = EnrollmentRepoQuery;
		this.StudentUseCaseQuery = StudentUseCaseQuery;
		this.CourseUseCaseQuery = CourseUseCaseQuery;
	}

	public async enroll({
		studentId,
		courseId
	}: {
		studentId: string;
		courseId: string;
	}): Promise<{ id: string }> {
		const course = await this.CourseUseCaseQuery.getCourse(courseId);
		const student = await this.StudentUseCaseQuery.getStudent(studentId);
		const countEnrollments = await this.EnrollmentRepoQuery.countById(courseId);
		// 檢查課跟學生是否存在
		if (!course || !student) {
			throw new Error('Course or Student not found');
		}
		// 檢查課是不是滿了
		if (countEnrollments >= course.props.studentCountRange.value.max) {
			throw new Error('Course is full');
		}

		// 檢查學生是否已經選過
		if (await this.EnrollmentRepoQuery.isExist(studentId, courseId)) {
			throw new Error('Student is already enrolled');
		}

		// 建立
		const en = await EnrollmentEntity.create({
			studentId: { value: studentId },
			courseId: { value: courseId }
		});
		await this.EnrollmentRepoCommand.save(en);
		return {
			id: en.props.id.value
		};
	}
}
