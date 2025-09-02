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
	console.log('course', {
		raw_data: courses,
		JSON_data: JSON.stringify(Array.from(courses.values()))
	});

	// 新增第二筆課程
	await ucCommand.createCourse({
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

	// 查詢單筆資料，用 newCourseResult 第一筆資料來測試
	findCourse = await ucQuery.getCourse(newCourseResult.id);
	console.log('*'.repeat(100) + '\n' + 'findCourse', {
		raw_data: findCourse,
		JSON_data: JSON.stringify(findCourse)
	});

	// 更新第一筆課程資料
	const updateCourseResult = await ucCommand.updateCourseField(newCourseResult.id, {
		title: CourseTitle.create('updated Course Title'),
		description: CourseDescription.create('updated Course Description')
	});
	if (!updateCourseResult.id) {
		throw new Error('Course update failed');
	}
	console.log('*'.repeat(100) + '\n' + 'Course updated successfully:', updateCourseResult);
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
}

/* 
export async function _main_() {
	const mockRepo = new MockCourseRepo();
	const uc = new CourseUseCase(mockRepo);

	const startDate = Date.now() + 1000 * 60 * 60 * 24 * 14;
	const newCourseResult = await uc.createCourse({
		title: CourseTitle.create('new Course'),
		description: CourseDescription.create('This is a new course description'),
		studentCountRange: CourseStudentCountRange.create({ min: 20, max: 60 }),
		period: CoursePeriod.create({ start: startDate, end: startDate + 1000 * 60 * 60 * 24 * 91 }),
		price: CoursePrice.create(200),
		status: CourseStatus.create(EnumCourseStatus.PENDING)
	});

	await uc.createCourse({
		title: CourseTitle.create('new Course 2'),
		description: CourseDescription.create('This is a new course description 2'),
		studentCountRange: CourseStudentCountRange.create({ min: 30, max: 50 }),
		period: CoursePeriod.create({ start: startDate, end: startDate + 1000 * 60 * 60 * 24 * 91 }),
		price: CoursePrice.create(300),
		status: CourseStatus.create(EnumCourseStatus.PENDING)
	});

	if (!newCourseResult.id) {
		throw new Error('Course creation failed');
	}
	const findCourse = await uc.getCourse(newCourseResult.id);
	let listCourse: CourseAggregate[] = [];
	listCourse = await uc.listCourses();

	console.log('newCourseResult', newCourseResult.id);
	console.log('mockRepo', mockRepo);
	console.log('findCourse', findCourse);
	console.log('listCourse', {
		raw_data: listCourse,
		JSON_data: JSON.stringify(listCourse)
	});

	if (findCourse) {
		await uc.updateCourseField(findCourse.id.value, {
			title: CourseTitle.create('updated Course Title'),
			description: CourseDescription.create('updated Course Description')
		});
	}

	const updateCourse = await uc.getCourse(newCourseResult.id);
	console.log('updateCourse', {
		raw_data: updateCourse,
		JSON_data: JSON.stringify(updateCourse)
	});

	const deletedCourseResult = await uc.deleteCourse(newCourseResult.id);
	if (!deletedCourseResult.id) {
		throw new Error('Course deletion failed');
	}
	console.log('Course deleted successfully:', deletedCourseResult);

	listCourse = await uc.listCourses();
	console.log('after delete - listCourse', {
		raw_data: listCourse,
		JSON_data: JSON.stringify(listCourse)
	});
}

*/
