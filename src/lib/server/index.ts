import { CourseUseCaseCommand } from './online-course/application/course.use-case.command';
import { CourseUseCaseQuery } from './online-course/application/course.use-case.query';
import { CourseAggregate } from './online-course/domain/course.ag';
import {
	CourseDescription,
	CoursePeriod,
	CourseStatus,
	CourseStudentCountRange,
	CourseTitle,
	EnumCourseStatus
} from './online-course/domain/course.vo';
import { MockCourseRepoCommand } from './online-course/infrastructure/mock-course.repo.command';
import { MockCourseRepoQuery } from './online-course/infrastructure/mock-course.repo.query';

export async function _main_() {
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
	} catch (error) {
		console.error('*'.repeat(100) + '\n' + 'Error occurred when processing courses:', error);
	}
}
