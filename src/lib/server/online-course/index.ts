import { CourseUseCaseCommand } from './application/course.use-case.command';
import { CourseUseCaseQuery } from './application/course.use-case.query';
import type { CourseAggregate } from './domain/course.ag';
import {
	CourseTitle,
	CourseDescription,
	CourseStudentCountRange,
	CoursePeriod,
	CoursePrice,
	CourseStatus,
	EnumCourseStatus
} from './domain/course.vo';
import { MockCourseRepoCommand } from './infrastructure/mock-course.repo.command';
import { MockCourseRepoQuery } from './infrastructure/mock-course.repo.query';

export async function _main_() {
	try {
		const courses = new Map();
		const mockRepoCommand = new MockCourseRepoCommand(courses);
		const ucCommand = new CourseUseCaseCommand(mockRepoCommand);
		const mockRepoQuery = new MockCourseRepoQuery(courses);
		const ucQuery = new CourseUseCaseQuery(mockRepoQuery);
		let findCourse: CourseAggregate | null = null;
		let allCourses: CourseAggregate[] = [];
		// 新增第一筆課程
		const startDate = Date.now() + 1000 * 60 * 60 * 24 * 14;
		const newCourseResult = await ucCommand.createCourse({
			title: CourseTitle.create('new Course'),
			description: CourseDescription.create('This is a new course description'),
			studentCountRange: CourseStudentCountRange.create({ min: 20, max: 60 }),
			period: CoursePeriod.create({ start: startDate, end: startDate + 1000 * 60 * 60 * 24 * 91 }),
			price: CoursePrice.create(200),
			status: CourseStatus.create(EnumCourseStatus.PENDING)
		});
		if (!newCourseResult.id) {
			throw new Error('Course creation failed');
		}
		console.log('*'.repeat(100) + '\n' + 'newCourseResult', newCourseResult);
		findCourse = await ucQuery.getCourse(newCourseResult.id);
		console.log('findCourse', {
			raw_data: findCourse,
			JSON_data: JSON.stringify(findCourse)
		});

		// 新增第二筆課程
		const secondCourseResult = await ucCommand.createCourse({
			title: CourseTitle.create('new Course 2'),
			description: CourseDescription.create('This is a new course description 2'),
			studentCountRange: CourseStudentCountRange.create({ min: 30, max: 50 }),
			period: CoursePeriod.create({ start: startDate, end: startDate + 1000 * 60 * 60 * 24 * 91 }),
			price: CoursePrice.create(300),
			status: CourseStatus.create(EnumCourseStatus.PENDING)
		});

		// 查詢目前所有課程
		allCourses = await ucQuery.listCourses();
		console.log('*'.repeat(100) + '\n' + 'allCourses', {
			raw_data: allCourses,
			JSON_data: JSON.stringify(allCourses)
		});

		// 將第一筆課程取消
		const cancelCourseResult = await ucCommand.cancelCourse(newCourseResult.id);
		if (!cancelCourseResult.id) {
			throw new Error('Course cancellation failed');
		}
		console.log('*'.repeat(100) + '\n' + 'Course cancelled successfully:', cancelCourseResult);
		findCourse = await ucQuery.getCourse(newCourseResult.id);
		console.log('findCourse', {
			raw_data: findCourse,
			JSON_data: JSON.stringify(findCourse)
		});

		// 刪除第一筆資料
		const deleteCourseResult = await ucCommand.deleteCourse(newCourseResult.id);
		if (!deleteCourseResult.id) {
			throw new Error('Course deletion failed');
		}
		console.log('*'.repeat(100) + '\n' + 'Course deleted successfully:', deleteCourseResult);
		// 查詢刪除第一筆之後目前所有課程
		allCourses = await ucQuery.listCourses();
		console.log('allCourses', {
			raw_data: allCourses,
			JSON_data: JSON.stringify(allCourses)
		});

		// 更新第二筆課程狀態為啟動
		const startCourseResult = await ucCommand.startCourse(secondCourseResult.id);
		if (!startCourseResult.id) {
			throw new Error('Course start failed');
		}
		console.log('*'.repeat(100) + '\n' + 'Course started successfully:', startCourseResult);
		findCourse = await ucQuery.getCourse(secondCourseResult.id);
		console.log('findCourse', {
			raw_data: findCourse,
			JSON_data: JSON.stringify(findCourse)
		});

		// 再次嘗試更新已啟動的課程狀態為取消，應該會失敗
		const cancelCourseResult_2 = await ucCommand.cancelCourse(secondCourseResult.id);
		if (!cancelCourseResult_2.id) {
			throw new Error('Course cancellation failed');
		}
		console.log('*'.repeat(100) + '\n' + 'Course cancelled successfully:', cancelCourseResult_2);
		findCourse = await ucQuery.getCourse(secondCourseResult.id);
		console.log('findCourse', {
			raw_data: findCourse,
			JSON_data: JSON.stringify(findCourse)
		});
	} catch (error) {
		console.error('*'.repeat(100) + '\n' + 'Error occurred when processing courses:', error);
	}
}
