import { CourseUseCase } from './online-course/application/course.use-case';
import { CourseAggregate } from './online-course/domain/course.ag';
import {
	CourseDescription,
	CoursePeriod,
	CourseStatus,
	CourseStudentCountRange,
	CourseTitle,
	EnumCourseStatus
} from './online-course/domain/course.vo';
import { MockCourseRepo } from './online-course/infrastructure/mock-course.repo';

export async function _main_() {
	try {
		const courseData = new Map();
		const mockRepo = new MockCourseRepo(courseData);
		const uc = new CourseUseCase(mockRepo);
		const startDate = Date.now() + 1000 * 60 * 60 * 24 * 14;
		let findCourse: CourseAggregate | null = null;
		let listCourse: CourseAggregate[] = [];

		const createNewCourseResult = await uc.createCourse({
			title: CourseTitle.create('new Course'),
			description: CourseDescription.create('This is a new course description'),
			studentCountRange: CourseStudentCountRange.create({ min: 20, max: 60 }),
			period: CoursePeriod.create({ start: startDate, end: startDate + 1000 * 60 * 60 * 24 * 91 }),
			status: CourseStatus.create(EnumCourseStatus.PENDING)
		});

		if (!createNewCourseResult.id) {
			throw new Error('Failed to create a new course');
		}

		findCourse = await uc.getCourse(createNewCourseResult.id);
		console.log('*'.repeat(100) + '\n' + 'find course after create', {
			raw_data: findCourse,
			JSON_data: JSON.stringify(findCourse)
		});

		await uc.createCourse({
			title: CourseTitle.create('new Course 2'),
			description: CourseDescription.create('This is a new course description 2'),
			studentCountRange: CourseStudentCountRange.create({ min: 30, max: 50 }),
			period: CoursePeriod.create({ start: startDate, end: startDate + 1000 * 60 * 60 * 24 * 91 }),
			status: CourseStatus.create(EnumCourseStatus.PENDING)
		});

		listCourse = await uc.listCourses();
		console.log('*'.repeat(100) + '\n' + 'listCourse after create second course', {
			raw_data: listCourse,
			JSON_data: JSON.stringify(listCourse)
		});

		const updateCourseResult = await uc.updateCourseField(createNewCourseResult.id, {
			title: CourseTitle.create('updated Course Title'),
			description: CourseDescription.create('updated Course Description')
		});

		if (!updateCourseResult.id) {
			throw new Error('Failed to update course');
		}
		console.log('*'.repeat(100) + '\n' + 'update Course successfully:', updateCourseResult);
		findCourse = await uc.getCourse(createNewCourseResult.id);
		console.log('find course after create', {
			raw_data: findCourse,
			JSON_data: JSON.stringify(findCourse)
		});

		const deletedCourseResult = await uc.deleteCourse(createNewCourseResult.id);
		if (!deletedCourseResult.id) {
			throw new Error('Failed to delete course');
		}

		console.log('*'.repeat(100) + '\n' + 'delete Course successfully:', deletedCourseResult);
		listCourse = await uc.listCourses();
		console.log('after delete - listCourse', {
			raw_data: listCourse,
			JSON_data: JSON.stringify(listCourse)
		});
	} catch (error) {
		console.error('*'.repeat(100) + '\n' + 'Error occurred when processing courses:', error);
	}
}
