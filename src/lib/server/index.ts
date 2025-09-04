import { CourseUseCaseCommand } from './online-course/application/course.use-case.command';
import { CourseUseCaseQuery } from './online-course/application/course.use-case.query';
import { StudentUseCaseCommand } from './online-course/application/student.use-case.command';
import { StudentUseCaseQuery } from './online-course/application/student.use-case.query';
import { CourseAggregate } from './online-course/domain/course.ag';
import {
	CourseDescription,
	CoursePeriod,
	CourseStatus,
	CourseStudentCountRange,
	CourseTitle,
	EnumCourseStatus
} from './online-course/domain/course.vo';
import type { StudentAggregate } from './online-course/domain/student.ag';
import { StudentEmail, StudentName } from './online-course/domain/student.vo';
import { MockCourseRepoCommand } from './online-course/infrastructure/mock-course.repo.command';
import { MockCourseRepoQuery } from './online-course/infrastructure/mock-course.repo.query';
import { MockStudentRepoCommand } from './online-course/infrastructure/mock-student.repo.command';
import { MockStudentRepoQuery } from './online-course/infrastructure/mock-student.repo.query';

async function _course_() {
	try {
		const courseData = new Map();
		const mockRepoCommand = new MockCourseRepoCommand(courseData);
		const ucCommand = new CourseUseCaseCommand(mockRepoCommand);
		const mockRepoQuery = new MockCourseRepoQuery(courseData);
		const ucQuery = new CourseUseCaseQuery(mockRepoQuery);

		const startDate = Date.now() + 1000 * 60 * 60 * 24 * 14;
		let findCourse: CourseAggregate | null = null;
		let listCourse: CourseAggregate[] = [];

		const createNewCourseResult = await ucCommand.createCourse({
			title: CourseTitle.create('new Course'),
			description: CourseDescription.create('This is a new course description'),
			studentCountRange: CourseStudentCountRange.create({ min: 20, max: 60 }),
			period: CoursePeriod.create({ start: startDate, end: startDate + 1000 * 60 * 60 * 24 * 91 }),
			status: CourseStatus.create(EnumCourseStatus.PENDING)
		});

		if (!createNewCourseResult.id) {
			throw new Error('Failed to create a new course');
		}

		findCourse = await ucQuery.getCourse(createNewCourseResult.id);
		console.log('*'.repeat(100) + '\n' + 'find course after create', {
			raw_data: findCourse,
			JSON_data: JSON.stringify(findCourse)
		});

		const secondCourseResult = await ucCommand.createCourse({
			title: CourseTitle.create('new Course 2'),
			description: CourseDescription.create('This is a new course description 2'),
			studentCountRange: CourseStudentCountRange.create({ min: 30, max: 50 }),
			period: CoursePeriod.create({ start: startDate, end: startDate + 1000 * 60 * 60 * 24 * 91 }),
			status: CourseStatus.create(EnumCourseStatus.PENDING)
		});
		if (!secondCourseResult.id) {
			throw new Error('Failed to create second course');
		}
		const createThirdCourseResult = await ucCommand.createCourse({
			title: CourseTitle.create('new Course 3'),
			description: CourseDescription.create('This is a new course description 3'),
			studentCountRange: CourseStudentCountRange.create({ min: 25, max: 55 }),
			period: CoursePeriod.create({ start: startDate, end: startDate + 1000 * 60 * 60 * 24 * 91 }),
			status: CourseStatus.create(EnumCourseStatus.PENDING)
		});
		if (!createThirdCourseResult.id) {
			throw new Error('Failed to create third course');
		}

		listCourse = await ucQuery.listCourses();
		console.log('*'.repeat(100) + '\n' + 'listCourse after create second course', {
			raw_data: listCourse,
			JSON_data: JSON.stringify(listCourse)
		});

		const deletedCourseResult = await ucCommand.deleteCourse(createNewCourseResult.id);
		if (!deletedCourseResult.id) {
			throw new Error('Failed to delete course');
		}

		console.log('*'.repeat(100) + '\n' + 'delete Course successfully:', deletedCourseResult);
		listCourse = await ucQuery.listCourses();
		console.log('after delete - listCourse', {
			raw_data: listCourse,
			JSON_data: JSON.stringify(listCourse)
		});

		// 開始課程
		const startCourseResult = await ucCommand.startCourse(secondCourseResult.id);
		if (!startCourseResult.id) {
			throw new Error('Failed to start course');
		}
		findCourse = await ucQuery.getCourse(startCourseResult.id);
		console.log('*'.repeat(100) + '\n' + 'start Course successfully:', startCourseResult, {
			raw_data: findCourse,
			JSON_data: JSON.stringify(findCourse)
		});

		// 將開始的課程取消，會失敗
		let cancelCourseResult: { id: string } | null = null;
		// cancelCourseResult = await ucCommand.cancelCourse(secondCourseResult.id);
		// if (!cancelCourseResult.id) {
		// 	throw new Error('Failed to cancel second course');
		// }
		// 將第三個課程取消，會成功
		cancelCourseResult = await ucCommand.cancelCourse(createThirdCourseResult.id);
		if (!cancelCourseResult.id) {
			throw new Error('Failed to cancel third course');
		}
		findCourse = await ucQuery.getCourse(createThirdCourseResult.id);
		console.log('find Course after cancel Third Course:', findCourse);
		return {
			startDate,
			ucCommand,
			ucQuery
		};
	} catch (error) {
		throw new Error('Error in _course_ function: ' + (error as Error).message);
	}
}

async function _student_() {
	const studentData = new Map();
	const mockRepoCommand = new MockStudentRepoCommand(studentData);
	const ucCommand = new StudentUseCaseCommand(mockRepoCommand);
	const mockRepoQuery = new MockStudentRepoQuery(studentData);
	const ucQuery = new StudentUseCaseQuery(mockRepoQuery);
	let findStudent: StudentAggregate | null = null;
	let listStudents: StudentAggregate[] = [];
	const create_student_1_result = await ucCommand.createStudent({
		name: new StudentName('Student 1'),
		email: new StudentEmail('student1@example.com')
	});
	if (!create_student_1_result.id) {
		throw new Error('Failed to create student 1');
	}
	console.log('*'.repeat(100) + '\n' + 'create_student_1_result', create_student_1_result);
	findStudent = await ucQuery.findById(create_student_1_result.id);
	console.log('findStudent', findStudent);
	await ucCommand.createStudent({
		name: new StudentName('Student 2'),
		email: new StudentEmail('student2@example.com')
	});
	await ucCommand.createStudent({
		name: new StudentName('Student 3'),
		email: new StudentEmail('student3@example.com')
	});

	listStudents = await ucQuery.list();
	console.log('*'.repeat(100) + '\n' + 'listStudents after creating 3 students:', {
		raw_data: listStudents,
		JSON_data: JSON.stringify(listStudents)
	});
	const delete_student_1_result = await ucCommand.deleteStudent(create_student_1_result.id);
	if (!delete_student_1_result.id) {
		throw new Error('Failed to delete student 1');
	}
	console.log('*'.repeat(100) + '\n' + 'delete_student_1_result', delete_student_1_result);
	listStudents = await ucQuery.list();
	console.log('listStudents after delete 1 students:', {
		raw_data: listStudents,
		JSON_data: JSON.stringify(listStudents)
	});
}

export async function _main_() {
	try {
		await _course_();
		await _student_();
	} catch (error) {
		console.error('*'.repeat(100) + '\n' + 'Error occurred :', error);
	}
}
